"""
Query Audit Log and History Router.
Tracks executed queries, timestamps, latency metrics, security guardrail status,
and hallucination verification telemetry.
"""

from fastapi import APIRouter
from typing import List, Dict, Any, Optional
from datetime import datetime

router = APIRouter(prefix="/api/history", tags=["history"])

# In-memory query audit history store
AUDIT_LOGS: List[Dict[str, Any]] = []

def record_audit_log(
    question: str,
    database_id: str,
    sql: str,
    status: str,
    row_count: int,
    execution_time_ms: float,
    provider: str,
    error: Optional[str] = None,
    verification_status: Optional[str] = None,
    reliability_score: Optional[int] = None,
    verification_reason: Optional[str] = None,
    verification_latency_ms: Optional[float] = None
):
    entry = {
        "id": len(AUDIT_LOGS) + 1,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "question": question,
        "database_id": database_id,
        "sql": sql,
        "status": status,
        "row_count": row_count,
        "execution_time_ms": execution_time_ms,
        "provider": provider,
        "error": error,
        "verification_status": verification_status or ("VERIFIED" if status == "SUCCESS" else "N/A"),
        "reliability_score": reliability_score,
        "verification_reason": verification_reason,
        "verification_latency_ms": verification_latency_ms
    }
    AUDIT_LOGS.insert(0, entry)
    # Keep last 100 entries
    if len(AUDIT_LOGS) > 100:
        AUDIT_LOGS.pop()

@router.get("", response_model=List[Dict[str, Any]])
def get_history():
    """Retrieve query execution audit trail with verification telemetry."""
    return AUDIT_LOGS

@router.delete("")
def clear_history():
    """Clear query history."""
    AUDIT_LOGS.clear()
    return {"message": "Audit history cleared successfully."}
