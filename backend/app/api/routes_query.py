"""
Query Orchestration Router with Hallucination Prevention.
Translates Natural Language to SQL, applies security validation, executes against the DB,
synthesizes grounded answers, verifies answer grounding against actual DB results,
and provides complete verification telemetry and visual trust pipeline.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.nl_to_sql import NLToSQLEngine
from app.core.query_validator import QueryValidator
from app.core.database_manager import db_manager
from app.core.summarizer import ResultSummarizer
from app.core.chart_detector import ChartDetector
from app.core.answer_verifier import AnswerVerifier
from app.api.routes_history import record_audit_log
from app.config import settings

router = APIRouter(prefix="/api/query", tags=["query"])

class QueryRequest(BaseModel):
    question: str
    database_id: Optional[str] = None
    provider: Optional[str] = None
    api_key: Optional[str] = None
    model_name: Optional[str] = None
    custom_sql: Optional[str] = None  # If user wants to execute raw SQL directly
    simulate_answer: Optional[str] = None  # For testing / demonstrating hallucination detection on arbitrary answers

class VerificationDetails(BaseModel):
    status: str = Field(..., description="VERIFIED, MOSTLY VERIFIED, NEEDS REVIEW, or UNVERIFIED")
    grounded: bool = Field(..., description="True if answer is fully supported by database evidence")
    reliability_score: int = Field(..., description="Reliability score from 0 to 100")
    hallucination_risk_pct: Optional[int] = Field(0, description="Hallucination Risk Probability %")
    hallucination_risk_level: Optional[str] = Field("MINIMAL", description="MINIMAL, LOW, ELEVATED, CRITICAL")
    reason: str = Field(..., description="Verification explanation")
    evidence: List[str] = Field(default_factory=list, description="Extracted evidence from DB rows")
    claims_breakdown: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Per-claim grounding classification")
    verification_latency_ms: float = 0.0
    checks: Optional[Dict[str, Any]] = None

class SecurityDetails(BaseModel):
    status: str = "SAFE"
    mode: str = "READ_ONLY_SANDBOX"
    rules_checked: List[str] = Field(default_factory=lambda: [
        "Read-Only Enforcement",
        "Destructive DDL/DML Blocked",
        "SQL Injection Multi-statement Blocked",
        "Row Limit Clamped"
    ])

class TrustPipelineStep(BaseModel):
    step_id: int
    name: str
    status: str  # SUCCESS, VERIFIED, BLOCKED, etc.
    description: str

class QueryResponse(BaseModel):
    question: str
    database_id: str
    intent: Optional[str] = None
    entities: Optional[List[str]] = None
    sort_by: Optional[str] = None
    generated_sql: str
    sanitized_sql: str
    is_safe: bool
    columns: List[str]
    rows: List[Dict[str, Any]]
    row_count: int
    execution_time_ms: float
    natural_answer: str
    chart: Optional[Dict[str, Any]] = None
    provider_used: str
    verification: VerificationDetails
    security: SecurityDetails
    trust_pipeline: List[TrustPipelineStep]
    verification_latency_ms: float

class VerifyRequest(BaseModel):
    question: str
    generated_answer: str
    database_id: Optional[str] = None
    sql: Optional[str] = None

@router.post("", response_model=QueryResponse)
async def process_question(req: QueryRequest):
    """
    Main Question-Answering & Verification Pipeline:
    Natural Language -> Understanding -> SQL Generation -> Security Validation ->
    Execution -> Grounded Answer Synthesis -> Hallucination Verification -> Final Response.
    """
    if not req.question.strip() and not req.custom_sql:
        raise HTTPException(status_code=400, detail="Please provide a valid question or SQL query.")

    db_id = req.database_id or settings.default_database_id

    try:
        # Step 1 & 2: Natural Language Understanding & SQL Generation
        if req.custom_sql:
            generated_sql = req.custom_sql.strip()
            intent = "Manual SQL Query"
            entities = ["Custom"]
            sort_by = None
            provider_used = "direct_sql"
        else:
            nl_result = await NLToSQLEngine.generate_sql(
                user_query=req.question,
                database_id=db_id,
                provider=req.provider,
                api_key=req.api_key,
                model_name=req.model_name
            )
            generated_sql = nl_result.get("sql", "").strip()
            intent = nl_result.get("intent", "Data Retrieval")
            entities = nl_result.get("entities", [])
            sort_by = nl_result.get("sort_by")
            provider_used = nl_result.get("provider_used", "ai_engine")

        # Step 3: Query Validation & Security Guardrails
        is_safe, sanitized_sql, error_msg = QueryValidator.sanitize_and_validate(
            generated_sql,
            default_limit=settings.max_query_rows
        )

        if not is_safe:
            record_audit_log(
                question=req.question,
                database_id=db_id,
                sql=generated_sql,
                status="BLOCKED_SECURITY",
                row_count=0,
                execution_time_ms=0.0,
                provider=provider_used,
                error=error_msg,
                verification_status="BLOCKED"
            )
            raise HTTPException(status_code=403, detail=f"Query Blocked by Security Guardrail: {error_msg}")

        # Step 4: Query Execution & Data Retrieval (Ground Truth Evidence)
        exec_res = db_manager.execute_query(db_id, sanitized_sql)
        columns = exec_res["columns"]
        rows = exec_res["rows"]
        row_count = exec_res["row_count"]
        exec_time = exec_res["execution_time_ms"]

        # Step 5: Grounded Answer Synthesis & Chart Recommendation
        if req.simulate_answer:
            # Allows simulating/testing hallucinated answers directly in testing/demo scenarios
            natural_answer = req.simulate_answer
        else:
            natural_answer = ResultSummarizer.generate_summary(
                user_query=req.question,
                sql_query=sanitized_sql,
                columns=columns,
                rows=rows,
                intent=intent
            )

        chart_spec = ChartDetector.detect_and_build_chart(
            columns=columns,
            rows=rows,
            intent=intent
        )

        # Step 6: Grounding & Hallucination Prevention Verification Layer
        verification_data = AnswerVerifier.verify_answer(
            user_query=req.question,
            sql_query=sanitized_sql,
            columns=columns,
            rows=rows,
            row_count=row_count,
            generated_answer=natural_answer,
            database_id=db_id,
            provider=req.provider,
            api_key=req.api_key,
            model_name=req.model_name
        )

        verification_obj = VerificationDetails(
            status=verification_data["status"],
            grounded=verification_data["grounded"],
            reliability_score=verification_data["reliability_score"],
            reason=verification_data["reason"],
            evidence=verification_data["evidence"],
            verification_latency_ms=verification_data["verification_latency_ms"],
            checks=verification_data["checks"]
        )

        # Step 7: Build Complete Visual Trust Pipeline
        trust_pipeline = [
            TrustPipelineStep(
                step_id=1,
                name="Question Analyzed",
                status="SUCCESS",
                description=f"Extracted intent '{intent}' and schema target '{db_id}'."
            ),
            TrustPipelineStep(
                step_id=2,
                name="SQL Query Generated",
                status="SUCCESS",
                description=f"Generated schema-aware SQL via {provider_used}."
            ),
            TrustPipelineStep(
                step_id=3,
                name="SQL Security Verified",
                status="SAFE",
                description="Verified 100% read-only, no injection chaining, limit clamped."
            ),
            TrustPipelineStep(
                step_id=4,
                name="Database Executed",
                status="SUCCESS",
                description=f"Retrieved {row_count} rows in {exec_time} ms."
            ),
            TrustPipelineStep(
                step_id=5,
                name="AI Answer Synthesized",
                status="SUCCESS",
                description="Synthesized conversational answer from returned rows."
            ),
            TrustPipelineStep(
                step_id=6,
                name="Hallucination Checked",
                status=verification_obj.status,
                description=f"Score: {verification_obj.reliability_score}/100 • {verification_obj.reason}"
            ),
            TrustPipelineStep(
                step_id=7,
                name="Final Response Delivered",
                status="VERIFIED" if verification_obj.grounded else "FLAGGED",
                description="Answer verified against actual database results." if verification_obj.grounded else "Warning: Answer contains unverified claims."
            )
        ]

        # Step 8: Record in Audit Log with Verification Telemetry
        record_audit_log(
            question=req.question,
            database_id=db_id,
            sql=sanitized_sql,
            status="SUCCESS",
            row_count=row_count,
            execution_time_ms=exec_time,
            provider=provider_used,
            verification_status=verification_obj.status,
            reliability_score=verification_obj.reliability_score,
            verification_reason=verification_obj.reason,
            verification_latency_ms=verification_obj.verification_latency_ms
        )

        return QueryResponse(
            question=req.question,
            database_id=db_id,
            intent=intent,
            entities=entities,
            sort_by=sort_by,
            generated_sql=generated_sql,
            sanitized_sql=sanitized_sql,
            is_safe=True,
            columns=columns,
            rows=rows,
            row_count=row_count,
            execution_time_ms=exec_time,
            natural_answer=natural_answer,
            chart=chart_spec,
            provider_used=provider_used,
            verification=verification_obj,
            security=SecurityDetails(),
            trust_pipeline=trust_pipeline,
            verification_latency_ms=verification_obj.verification_latency_ms
        )

    except HTTPException:
        raise
    except Exception as e:
        record_audit_log(
            question=req.question,
            database_id=db_id,
            sql=generated_sql if 'generated_sql' in locals() else "",
            status="ERROR",
            row_count=0,
            execution_time_ms=0.0,
            provider=provider_used if 'provider_used' in locals() else "unknown",
            error=str(e),
            verification_status="ERROR"
        )
        raise HTTPException(status_code=500, detail=f"Database execution error: {str(e)}")

@router.post("/verify", response_model=VerificationDetails)
async def verify_custom_answer(req: VerifyRequest):
    """
    Dedicated endpoint to verify any arbitrary answer against the database query result.
    Useful for testing hallucinated claims vs grounded answers.
    """
    db_id = req.database_id or settings.default_database_id
    
    # Generate or use provided SQL
    if req.sql:
        sql = req.sql
    else:
        nl_res = await NLToSQLEngine.generate_sql(req.question, db_id, provider="offline")
        sql = nl_res.get("sql", "")

    is_safe, sanitized_sql, err = QueryValidator.sanitize_and_validate(sql)
    if not is_safe:
        raise HTTPException(status_code=400, detail=f"Invalid SQL: {err}")

    exec_res = db_manager.execute_query(db_id, sanitized_sql)
    verification = AnswerVerifier.verify_answer(
        user_query=req.question,
        sql_query=sanitized_sql,
        columns=exec_res["columns"],
        rows=exec_res["rows"],
        row_count=exec_res["row_count"],
        generated_answer=req.generated_answer,
        database_id=db_id
    )

    return VerificationDetails(
        status=verification["status"],
        grounded=verification["grounded"],
        reliability_score=verification["reliability_score"],
        reason=verification["reason"],
        evidence=verification["evidence"],
        verification_latency_ms=verification["verification_latency_ms"],
        checks=verification["checks"]
    )
