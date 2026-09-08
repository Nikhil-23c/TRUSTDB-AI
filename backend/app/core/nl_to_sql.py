"""
Schema-Aware NL to SQL Engine.
Orchestrates LLM inference (Google Gemini, OpenAI, Ollama) and seamlessly
falls back to the Offline Heuristic Engine if no API key is provided or on any error.
"""

import os
import json
import re
import httpx
from typing import Dict, Any, Optional
from app.config import settings
from app.core.database_manager import db_manager
from app.core.offline_engine import OfflineNLEngine
from app.core.query_validator import QueryValidator

SYSTEM_PROMPT_TEMPLATE = """You are an expert SQL Data Analyst and Assistant.
Your task is to translate the user's natural language question into a safe, valid, read-only SQL query for the following database schema:

{schema_context}

CRITICAL RULES:
1. Generate ONLY read-only queries (SELECT or WITH ... SELECT).
2. NEVER generate DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE, or other destructive SQL commands.
3. Use only tables and columns defined in the schema.
4. Output your response as a valid JSON object with the following structure:
{{
    "intent": "Short title of the intent (e.g. 'Get Top Records', 'Calculate Average', 'Filter by Threshold')",
    "entities": ["List", "of", "extracted", "entities", "or", "columns"],
    "sort_by": "Column name or None",
    "limit": 5,
    "sql": "SELECT ...;",
    "explanation": "Brief explanation of how the query answers the user question."
}}
Do NOT wrap the JSON in extra prose. Output pure JSON only.
"""

class NLToSQLEngine:
    @staticmethod
    async def generate_sql(
        user_query: str,
        database_id: str,
        provider: Optional[str] = None,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Translates a natural language query to SQL using LLM or offline engine.
        """
        provider = (provider or settings.llm_provider).lower()
        active_api_key = api_key or (settings.gemini_api_key if provider == "gemini" else settings.openai_api_key)
        
        # 1. Fetch Schema Metadata
        schema_data = db_manager.introspect_schema(database_id)
        schema_text = db_manager.get_schema_prompt_text(database_id)

        # 2. If provider is offline or no API key is available, use OfflineNLEngine
        if provider == "offline" or (provider in ["gemini", "openai"] and not active_api_key):
            offline_res = OfflineNLEngine.analyze_and_generate(user_query, schema_data)
            offline_res["provider_used"] = "offline_heuristic_engine"
            offline_res["explanation"] = f"Heuristically resolved query based on schema for: '{user_query}'"
            return offline_res

        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(schema_context=schema_text)

        # 3. Call Gemini API (supports both google-genai and google-generativeai)
        if provider == "gemini":
            try:
                target_model = model_name or settings.model_name or "gemini-2.5-flash"
                raw_text = ""
                
                # Try new google.genai SDK
                try:
                    from google import genai
                    client = genai.Client(api_key=active_api_key)
                    response = client.models.generate_content(
                        model=target_model,
                        contents=f"{system_prompt}\n\nUser Question: {user_query}",
                    )
                    raw_text = response.text or ""
                except (ImportError, AttributeError, Exception) as genai_err:
                    # Fallback to google.generativeai SDK if installed
                    try:
                        import google.generativeai as legacy_genai
                        legacy_genai.configure(api_key=active_api_key)
                        model = legacy_genai.GenerativeModel(target_model)
                        response = model.generate_content(f"{system_prompt}\n\nUser Question: {user_query}")
                        raw_text = response.text or ""
                    except Exception:
                        raise genai_err

                parsed = NLToSQLEngine._parse_llm_json(raw_text)
                parsed["provider_used"] = f"gemini ({target_model})"
                return parsed
            except Exception as e:
                # Fallback to offline engine on failure
                fallback = OfflineNLEngine.analyze_and_generate(user_query, schema_data)
                fallback["provider_used"] = f"offline_fallback (Gemini Error: {str(e)[:60]}...)"
                fallback["explanation"] = f"Auto-fallback to rule engine due to LLM error: {str(e)[:80]}"
                return fallback

        # 4. Call OpenAI API
        elif provider == "openai":
            try:
                target_model = model_name or "gpt-4o-mini"
                async with httpx.AsyncClient(timeout=15.0) as client:
                    res = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {active_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": target_model,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_query}
                            ],
                            "response_format": {"type": "json_object"}
                        }
                    )
                    data = res.json()
                    raw_text = data["choices"][0]["message"]["content"]
                    parsed = NLToSQLEngine._parse_llm_json(raw_text)
                    parsed["provider_used"] = f"openai ({target_model})"
                    return parsed
            except Exception as e:
                fallback = OfflineNLEngine.analyze_and_generate(user_query, schema_data)
                fallback["provider_used"] = f"offline_fallback (OpenAI Error: {str(e)[:60]}...)"
                fallback["explanation"] = f"Auto-fallback to rule engine due to LLM error: {str(e)[:80]}"
                return fallback

        # 5. Call Local Ollama
        elif provider == "ollama":
            try:
                ollama_url = f"{settings.ollama_url.rstrip('/')}/api/generate"
                target_model = model_name or "llama3"
                async with httpx.AsyncClient(timeout=30.0) as client:
                    res = await client.post(
                        ollama_url,
                        json={
                            "model": target_model,
                            "prompt": f"{system_prompt}\n\nUser Question: {user_query}",
                            "format": "json",
                            "stream": False
                        }
                    )
                    data = res.json()
                    raw_text = data.get("response", "")
                    parsed = NLToSQLEngine._parse_llm_json(raw_text)
                    parsed["provider_used"] = f"ollama ({target_model})"
                    return parsed
            except Exception as e:
                fallback = OfflineNLEngine.analyze_and_generate(user_query, schema_data)
                fallback["provider_used"] = f"offline_fallback (Ollama Error: {str(e)[:60]}...)"
                fallback["explanation"] = f"Auto-fallback to rule engine due to LLM error: {str(e)[:80]}"
                return fallback

        # Default fallback
        return OfflineNLEngine.analyze_and_generate(user_query, schema_data)

    @staticmethod
    def _parse_llm_json(text: str) -> Dict[str, Any]:
        """Safely extracts and parses JSON from LLM output."""
        clean = (text or "").strip()
        
        # 1. Check for markdown code fence anywhere in the string
        code_fence_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', clean, re.IGNORECASE)
        if code_fence_match:
            candidate = code_fence_match.group(1).strip()
            try:
                data = json.loads(candidate)
                if isinstance(data, dict):
                    return data
            except json.JSONDecodeError:
                pass

        # 2. Direct JSON load attempt
        try:
            data = json.loads(clean)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass

        # 3. Match outermost { ... } block
        match = re.search(r'(\{[\s\S]*\})', clean)
        if match:
            candidate = match.group(1)
            # Remove trailing commas before closing braces if present
            fixed_candidate = re.sub(r',\s*([\}\]])', r'\1', candidate)
            try:
                data = json.loads(fixed_candidate)
                if isinstance(data, dict):
                    return data
            except Exception:
                pass
        
        # 4. Extract SQL directly if JSON structure failed
        sql_match = re.search(r'(?:SELECT|WITH)\s+[\s\S]*?;', clean, re.IGNORECASE)
        sql = sql_match.group(0).strip() if sql_match else clean
        return {
            "intent": "Generated Query",
            "entities": [],
            "sort_by": None,
            "limit": None,
            "sql": sql,
            "explanation": "Extracted SQL directly from model response."
        }

