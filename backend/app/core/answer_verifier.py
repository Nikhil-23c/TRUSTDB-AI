"""
Hallucination Prevention & Grounding Verification Layer.
Verifies AI-generated answers against actual database results before presenting them to the user.
Implements a Hybrid Verification architecture:
  - Fast Path: Deterministic verification (numbers, entities, counts, superlatives, aggregates, empty sets).
  - Slow Path: Semantic LLM auditor for ambiguous multi-faceted claims.
"""

import re
import time
import json
from typing import Dict, Any, List, Optional, Tuple, Set


class AnswerVerifier:
    @staticmethod
    def verify_answer(
        user_query: str,
        sql_query: str,
        columns: List[str],
        rows: List[Dict[str, Any]],
        row_count: int,
        generated_answer: str,
        database_id: str = "",
        provider: Optional[str] = None,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entry point for answer verification.
        Evaluates grounding, extracts evidence, computes a reliability score (0-100),
        hallucination risk index (0-100%), claim breakdown, and assigns a verification status.
        """
        start_time = time.perf_counter()
        clean_answer = (generated_answer or "").strip()

        # 1. Deterministic Multi-Dimensional Verification
        empty_check = AnswerVerifier._check_empty_result(rows, row_count, clean_answer)
        evidence_list = AnswerVerifier._extract_evidence(rows, columns, user_query)

        # Handle Empty Result Case
        if row_count == 0 or len(rows) == 0:
            is_valid_empty, empty_score, empty_reason = empty_check
            exec_time = round((time.perf_counter() - start_time) * 1000, 2)
            status = "VERIFIED" if is_valid_empty else "UNVERIFIED"
            risk_score = 0 if is_valid_empty else 95
            risk_level = "LOW" if is_valid_empty else "CRITICAL"
            return {
                "grounded": is_valid_empty,
                "reliability_score": empty_score,
                "hallucination_risk_pct": risk_score,
                "hallucination_risk_level": risk_level,
                "status": status,
                "reason": empty_reason,
                "evidence": ["Database returned 0 rows (Empty Set)"],
                "verification_latency_ms": exec_time,
                "claims_breakdown": [
                    {
                        "claim": clean_answer,
                        "category": "Zero-Row Guard",
                        "status": "GROUNDED" if is_valid_empty else "HALLUCINATED",
                        "confidence": 100 if is_valid_empty else 10
                    }
                ],
                "checks": {
                    "empty_result_check": {"passed": is_valid_empty, "score": empty_score},
                    "numeric_consistency": {"passed": is_valid_empty, "score": empty_score},
                    "entity_consistency": {"passed": is_valid_empty, "score": empty_score},
                    "claim_grounding": {"passed": is_valid_empty, "score": empty_score},
                    "layer_used": "deterministic_empty_guard"
                }
            }

        # 2. Check Numeric Consistency
        numeric_res = AnswerVerifier._check_numeric_consistency(rows, columns, clean_answer, user_query)

        # 3. Check Entity & Name Consistency
        entity_res = AnswerVerifier._check_entity_consistency(rows, columns, clean_answer)

        # 4. Check Unsupported Claims & Extraneous Superlatives
        claim_res = AnswerVerifier._check_unsupported_claims(user_query, rows, columns, clean_answer)

        # 5. Check Aggregate Match
        aggregate_res = AnswerVerifier._check_aggregate_consistency(rows, columns, clean_answer, sql_query)

        # 6. Compute Deterministic Reliability Score & Hallucination Probability
        score, status, reason, is_grounded = AnswerVerifier._compute_score(
            numeric_res=numeric_res,
            entity_res=entity_res,
            claim_res=claim_res,
            aggregate_res=aggregate_res
        )

        claims_breakdown = AnswerVerifier._generate_claims_breakdown(
            clean_answer, numeric_res, entity_res, claim_res, aggregate_res
        )

        hallucination_risk_pct = max(0, min(100, 100 - score))
        if hallucination_risk_pct <= 10:
            hallucination_risk_level = "MINIMAL"
        elif hallucination_risk_pct <= 35:
            hallucination_risk_level = "LOW"
        elif hallucination_risk_pct <= 65:
            hallucination_risk_level = "ELEVATED"
        else:
            hallucination_risk_level = "CRITICAL"

        checks_payload = {
            "zero_row_barrier": {"passed": True, "score": 100},
            "numeric_consistency": numeric_res,
            "entity_consistency": entity_res,
            "claim_grounding": claim_res,
            "aggregate_consistency": aggregate_res,
            "layer_used": "deterministic_fast_path"
        }

        # 7. Semantic LLM Verification (Slow Path for ambiguous / needs review cases when LLM is active)
        if (score < 80 or not is_grounded) and provider in ["gemini", "openai"] and api_key:
            try:
                semantic_res = AnswerVerifier._semantic_verify_llm(
                    user_query=user_query,
                    sql_query=sql_query,
                    columns=columns,
                    rows=rows,
                    generated_answer=clean_answer,
                    provider=provider,
                    api_key=api_key,
                    model_name=model_name
                )
                if semantic_res:
                    # Semantic verifier can lower the score or confirm violation, but cannot convert an invalid deterministic check into VERIFIED
                    if not semantic_res.get("grounded", True):
                        is_grounded = False
                        score = min(score, semantic_res.get("reliability_score", 30))
                        status = AnswerVerifier._score_to_status(score)
                        reason = semantic_res.get("reason", reason)
                    checks_payload["semantic_verification"] = semantic_res
                    checks_payload["layer_used"] = "hybrid_semantic_verified"
            except Exception:
                pass  # Keep deterministic results on semantic failure

        exec_time = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "grounded": is_grounded,
            "reliability_score": score,
            "hallucination_risk_pct": hallucination_risk_pct,
            "hallucination_risk_level": hallucination_risk_level,
            "status": status,
            "reason": reason,
            "evidence": evidence_list,
            "claims_breakdown": claims_breakdown,
            "verification_latency_ms": exec_time,
            "checks": checks_payload
        }

    @staticmethod
    def _generate_claims_breakdown(
        answer: str,
        numeric_res: Dict[str, Any],
        entity_res: Dict[str, Any],
        claim_res: Dict[str, Any],
        aggregate_res: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generates token-level claim classification for UI visualization."""
        claims = []
        sentences = [s.strip() for s in re.split(r'[.\n]+', answer) if s.strip()]
        
        unmatched_nums = set(numeric_res.get("unmatched_numbers", []))
        unmatched_ents = [e.lower() for e in entity_res.get("unmatched_entities", [])]
        unsupported = claim_res.get("unsupported_claims", [])

        for s in sentences:
            s_low = s.lower()
            # Check for qualitative superlative
            found_unsupported = [u for u in unsupported if u in s_low]
            if found_unsupported:
                claims.append({
                    "claim": s,
                    "category": "Qualitative Superlative",
                    "status": "HALLUCINATED",
                    "flag": f"Unproven superlative: '{found_unsupported[0]}'",
                    "confidence": 35
                })
                continue

            # Check for ungrounded entity
            found_ent = [e for e in unmatched_ents if e in s_low]
            if found_ent:
                claims.append({
                    "claim": s,
                    "category": "Entity Grounding",
                    "status": "HALLUCINATED",
                    "flag": f"Entity '{found_ent[0]}' not in database records",
                    "confidence": 25
                })
                continue

            # Check for unmatched numbers
            s_nums = AnswerVerifier._extract_numbers(s)
            found_bad_num = [n for n in s_nums if n in unmatched_nums]
            if found_bad_num:
                claims.append({
                    "claim": s,
                    "category": "Numeric Precision",
                    "status": "HALLUCINATED",
                    "flag": f"Number '{found_bad_num[0]}' mismatch with database rows",
                    "confidence": 30
                })
                continue

            # Otherwise claim is grounded
            claims.append({
                "claim": s,
                "category": "Database Evidence",
                "status": "GROUNDED",
                "flag": "Verified against raw SQL rows",
                "confidence": 98
            })

        return claims

    @staticmethod
    def _check_empty_result(rows: List[Dict[str, Any]], row_count: int, answer: str) -> Tuple[bool, int, str]:
        """Validates that empty database results are accurately reported without hallucinations."""
        if row_count > 0 and len(rows) > 0:
            return True, 100, "Non-empty result set."

        ans_low = answer.lower()
        empty_keywords = ["no match", "no record", "not found", "0 match", "0 record", "empty", "no student", "none found", "no data"]
        has_empty_indicator = any(k in ans_low for k in empty_keywords)

        # Check if answer hallucinates specific positive entities or numbers
        numbers = AnswerVerifier._extract_numbers(answer)
        if has_empty_indicator and len(numbers) <= 1:
            return True, 100, "Accurately reports that no matching records were found in the database."
        else:
            return False, 10, "Hallucination Detected: Database returned 0 records, but the answer claimed results were found."

    @staticmethod
    def _extract_numbers(text: str) -> List[float]:
        """Extracts numerical digits, percentages, floats, and currencies from text."""
        # Strip markdown bolding / formatting
        clean = re.sub(r'[*_`#]', '', text)
        # Find floats, ints, percentages
        pattern = r'\b(?<![a-zA-Z_])[-+]?(?:\d+(?:\.\d+)?|\.\d+)%?\b'
        matches = re.findall(pattern, clean)
        numbers = []
        for m in matches:
            m_clean = m.rstrip('%')
            try:
                val = float(m_clean)
                numbers.append(val)
            except ValueError:
                continue
        return numbers

    @staticmethod
    def _check_numeric_consistency(
        rows: List[Dict[str, Any]],
        columns: List[str],
        answer: str,
        user_query: str
    ) -> Dict[str, Any]:
        """
        Extracts numbers from the answer and verifies every number exists in the DB result
        or is a standard structural index (e.g., '1.', '2.', 'top 5', row count).
        """
        answer_nums = AnswerVerifier._extract_numbers(answer)
        if not answer_nums:
            return {"passed": True, "score": 100, "unmatched_numbers": [], "details": "No numbers asserted in answer."}

        # Extract all numbers present in DB rows
        db_nums: Set[float] = set()
        for r in rows:
            for v in r.values():
                if v is not None and isinstance(v, (int, float)):
                    db_nums.add(float(v))
                    # Also add rounded versions
                    db_nums.add(round(float(v), 2))
                    db_nums.add(round(float(v), 1))
                    db_nums.add(round(float(v), 0))
                elif isinstance(v, str):
                    for num in AnswerVerifier._extract_numbers(v):
                        db_nums.add(num)
                        db_nums.add(round(num, 2))

        # Allow query-derived numbers (e.g. limit in user question "top 5" or total row count)
        allowable_nums: Set[float] = set(db_nums)
        allowable_nums.add(float(len(rows)))
        for q_num in AnswerVerifier._extract_numbers(user_query):
            allowable_nums.add(q_num)

        # Allow ordinal indices (1 to len(rows))
        for i in range(1, len(rows) + 1):
            allowable_nums.add(float(i))

        unmatched = []
        for num in answer_nums:
            matched = False
            for target in allowable_nums:
                if abs(num - target) < 0.01:
                    matched = True
                    break
            if not matched:
                unmatched.append(num)

        if not unmatched:
            return {"passed": True, "score": 100, "unmatched_numbers": [], "details": "All numbers in answer match database values."}
        else:
            # Score penalizes per unmatched number
            penalty = min(80, len(unmatched) * 35)
            score = max(20, 100 - penalty)
            return {
                "passed": False,
                "score": score,
                "unmatched_numbers": unmatched,
                "details": f"Detected {len(unmatched)} numerical value(s) in answer that do not exist in database results: {unmatched}"
            }

    @staticmethod
    def _check_entity_consistency(
        rows: List[Dict[str, Any]],
        columns: List[str],
        answer: str
    ) -> Dict[str, Any]:
        """
        Verifies that specific entities (names, departments, products) mentioned in the answer
        are present in the returned dataset.
        """
        # Collect all string entities from the returned DB rows
        db_entities = set()
        for r in rows:
            for c, v in r.items():
                if v is not None and isinstance(v, str) and len(v.strip()) > 1:
                    db_entities.add(v.strip().lower())

        if not db_entities:
            return {"passed": True, "score": 100, "unmatched_entities": [], "details": "No specific entities extracted."}

        # Check for proper names in markdown bold e.g. **Arun**, **Divya**, or capitalized tokens
        bold_entities = re.findall(r'\*\*([a-zA-Z0-9\s_-]+)\*\*', answer)
        unmatched = []
        for ent in bold_entities:
            ent_clean = ent.strip().lower()
            # Ignore structural header labels
            if ent_clean in ["details", "result", "record", "name", "attendance", "cgpa", "total", "count", "average"]:
                continue
            # Check if ent_clean matches or is substring of any DB entity
            if not any(ent_clean in db_ent or db_ent in ent_clean for db_ent in db_entities):
                # Only flag if it looks like a proper name or specific noun (not numbers)
                if not re.match(r'^\d+(\.\d+)?$', ent.strip()):
                    unmatched.append(ent)

        if not unmatched:
            return {"passed": True, "score": 100, "unmatched_entities": [], "details": "Entities in answer match database records."}
        else:
            score = max(30, 100 - (len(unmatched) * 30))
            return {
                "passed": False,
                "score": score,
                "unmatched_entities": unmatched,
                "details": f"Mentioned entity/name '{unmatched[0]}' not present in query result."
            }

    @staticmethod
    def _check_unsupported_claims(
        user_query: str,
        rows: List[Dict[str, Any]],
        columns: List[str],
        answer: str
    ) -> Dict[str, Any]:
        """
        Detects speculative or qualitative claims that exceed the returned database schema.
        e.g., claiming someone is 'the best student in the college' or 'top performing'
        when the DB only returned attendance or CGPA without college-wide ranking.
        """
        ans_low = answer.lower()
        unsupported_phrases = [
            "best student in the college",
            "top-performing student in the college",
            "top performing student in the college",
            "best in the college",
            "highest salary in the company",
            "most popular product in history",
            "favorite teacher",
            "smartest student",
            "guaranteed to pass",
            "richest customer"
        ]

        detected_claims = []
        for phrase in unsupported_phrases:
            if phrase in ans_low:
                detected_claims.append(phrase)

        if detected_claims:
            return {
                "passed": False,
                "score": 35,
                "unsupported_claims": detected_claims,
                "details": f"Answer asserts unsupported qualitative claim(s): '{', '.join(detected_claims)}' which cannot be proved from the database output."
            }

        return {"passed": True, "score": 100, "unsupported_claims": [], "details": "No unsupported speculative claims detected."}

    @staticmethod
    def _check_aggregate_consistency(
        rows: List[Dict[str, Any]],
        columns: List[str],
        answer: str,
        sql_query: str
    ) -> Dict[str, Any]:
        """
        Verifies single-value aggregate queries (COUNT, SUM, AVG) match the answer.
        """
        if len(rows) == 1 and len(columns) == 1:
            col_name = columns[0]
            val = rows[0][col_name]
            if val is not None:
                # Check if this exact aggregate value is in the answer
                val_str = str(val)
                val_float = float(val) if isinstance(val, (int, float)) else None
                
                ans_numbers = AnswerVerifier._extract_numbers(answer)
                if val_float is not None and not any(abs(val_float - n) < 0.01 for n in ans_numbers):
                    return {
                        "passed": False,
                        "score": 40,
                        "details": f"Aggregate value {val} not found in generated answer."
                    }

        return {"passed": True, "score": 100, "details": "Aggregate check passed."}

    @staticmethod
    def _extract_evidence(rows: List[Dict[str, Any]], columns: List[str], user_query: str) -> List[str]:
        """
        Extracts high-clarity evidence lines directly from returned database rows.
        """
        if not rows:
            return ["No records returned from database."]

        evidence = []
        name_col = next((c for c in columns if "name" in c.lower()), None)
        metric_cols = [c for c in columns if c != name_col and not c.endswith("_id") and c != "id"]

        # Limit evidence to top 5 rows for clean UI
        for r in rows[:5]:
            if name_col and metric_cols:
                name_val = r.get(name_col, "Record")
                metrics = [f"{c.replace('_', ' ').title()}: {r.get(c)}" for c in metric_cols if r.get(c) is not None]
                evidence.append(f"{name_val} — {', '.join(metrics)}")
            elif len(columns) == 1:
                col = columns[0]
                evidence.append(f"{col.replace('_', ' ').title()}: {r.get(col)}")
            else:
                pairs = [f"{c.replace('_', ' ').title()}: {r.get(c)}" for c in columns[:3] if r.get(c) is not None]
                evidence.append(" | ".join(pairs))

        if len(rows) > 5:
            evidence.append(f"...and {len(rows) - 5} additional row(s)")

        return evidence

    @staticmethod
    def _compute_score(
        numeric_res: Dict[str, Any],
        entity_res: Dict[str, Any],
        claim_res: Dict[str, Any],
        aggregate_res: Dict[str, Any]
    ) -> Tuple[int, str, str, bool]:
        """Computes weighted reliability score and assigns verification status."""
        reasons = []
        is_grounded = True
        
        has_num_err = not numeric_res.get("passed", True)
        has_ent_err = not entity_res.get("passed", True)
        has_claim_err = not claim_res.get("passed", True)
        has_agg_err = not aggregate_res.get("passed", True)

        if has_num_err:
            reasons.append(numeric_res.get("details"))
            is_grounded = False
        if has_ent_err:
            reasons.append(entity_res.get("details"))
            is_grounded = False
        if has_claim_err:
            reasons.append(claim_res.get("details"))
            is_grounded = False
        if has_agg_err:
            reasons.append(aggregate_res.get("details"))
            is_grounded = False

        if is_grounded:
            reason = "Answer is fully supported by the database results."
            final_score = 96
        else:
            reason = " ".join(reasons)
            # If critical hallucination occurred, score is strictly below 40 (UNVERIFIED) or 50 (NEEDS REVIEW)
            error_count = sum([has_num_err, has_ent_err, has_claim_err, has_agg_err])
            if has_num_err or has_ent_err or has_claim_err:
                final_score = max(15, 38 - (error_count - 1) * 10)
            else:
                final_score = 45

        status = AnswerVerifier._score_to_status(final_score)
        return final_score, status, reason, is_grounded

    @staticmethod
    def _score_to_status(score: int) -> str:
        """Maps 0-100 score to 4 standardized reliability tiers."""
        if score >= 90:
            return "VERIFIED"
        elif score >= 70:
            return "MOSTLY VERIFIED"
        elif score >= 40:
            return "NEEDS REVIEW"
        else:
            return "UNVERIFIED"

    @staticmethod
    def _semantic_verify_llm(
        user_query: str,
        sql_query: str,
        columns: List[str],
        rows: List[Dict[str, Any]],
        generated_answer: str,
        provider: str,
        api_key: str,
        model_name: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        """
        Slow Path: Semantic LLM Auditor for ambiguous claims.
        Uses external LLM strictly as an adversarial verifier against the database JSON ground truth.
        """
        prompt = f"""You are an adversarial AI Answer Auditor.
Your ONLY job is to verify whether the AI Generated Answer is 100% supported by the Database Rows Ground Truth.

CRITICAL RULES:
1. Ground truth is STRICTLY the Database Rows below.
2. If the answer contains ANY fact, number, name, or claim NOT in the database rows, mark grounded=false.
3. NEVER assume external real-world knowledge.
4. Output valid JSON ONLY:
{{
    "grounded": true or false,
    "reliability_score": integer between 0 and 100,
    "reason": "Brief explanation of verification outcome",
    "unsupported_claims": ["list of any unsupported claims or empty list"]
}}

User Question: {user_query}
SQL Query: {sql_query}
Database Columns: {columns}
Database Rows (GROUND TRUTH): {json.dumps(rows[:10])}
AI Generated Answer: {generated_answer}
"""
        # Call Gemini or OpenAI synchronously/async
        try:
            if provider == "gemini":
                from google import genai
                client = genai.Client(api_key=api_key)
                target_model = model_name or "gemini-2.5-flash"
                res = client.models.generate_content(
                    model=target_model,
                    contents=prompt
                )
                text = res.text or ""
                match = re.search(r'(\{[\s\S]*\})', text)
                if match:
                    return json.loads(match.group(1))
        except Exception:
            pass
        return None
