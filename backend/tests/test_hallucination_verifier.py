"""
Unit and Integration Tests for the Hallucination Prevention & Answer Verification Layer.
Tests the 5 core Hackathon demo scenarios plus edge cases (numeric mismatch, unsupported claims, empty results, aggregates).
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.answer_verifier import AnswerVerifier
from app.core.database_manager import db_manager


# ==============================================================================
# 1. Direct Unit Tests for AnswerVerifier
# ==============================================================================

def test_scenario_a_verified_attendance():
    """
    SCENARIO A: Verified Answer
    Question: "Who has the highest attendance?"
    Database: Arun (96.0%)
    Answer: "Arun has the highest attendance at 96%."
    Expected: Status VERIFIED, reliability score >= 90.
    """
    rows = [{"name": "Arun", "email": "arun@college.edu", "attendance_percentage": 96.0, "attended_classes": 58, "total_classes": 60}]
    columns = ["name", "email", "attendance_percentage", "attended_classes", "total_classes"]
    
    res = AnswerVerifier.verify_answer(
        user_query="Who has the highest attendance?",
        sql_query="SELECT name, email, attendance_percentage FROM students JOIN attendance ...",
        columns=columns,
        rows=rows,
        row_count=1,
        generated_answer="**Arun** has the highest attendance at **96%**.",
        database_id="college_records"
    )

    assert res["grounded"] is True
    assert res["reliability_score"] >= 90
    assert res["status"] == "VERIFIED"
    assert "fully supported" in res["reason"].lower()
    assert any("Arun" in ev for ev in res["evidence"])
    assert res["checks"]["numeric_consistency"]["passed"] is True
    assert res["checks"]["entity_consistency"]["passed"] is True


def test_scenario_b_hallucination_unsupported_claim():
    """
    SCENARIO B: Hallucination / Unsupported Claim Detection
    Database: Arun = 96%
    Answer: "Arun has 96% attendance and is the top-performing student in the college."
    Expected: Status UNVERIFIED or NEEDS REVIEW, score < 70, detect unsupported qualitative claim.
    """
    rows = [{"name": "Arun", "attendance_percentage": 96.0}]
    columns = ["name", "attendance_percentage"]
    
    res = AnswerVerifier.verify_answer(
        user_query="Who has the highest attendance?",
        sql_query="SELECT name, attendance_percentage FROM students JOIN attendance ...",
        columns=columns,
        rows=rows,
        row_count=1,
        generated_answer="**Arun** has 96% attendance and is the top-performing student in the college.",
        database_id="college_records"
    )

    assert res["grounded"] is False
    assert res["reliability_score"] < 70
    assert res["status"] in ["UNVERIFIED", "NEEDS REVIEW"]
    assert res["checks"]["claim_grounding"]["passed"] is False
    assert "top-performing student in the college" in res["reason"] or "unsupported" in res["reason"].lower()


def test_scenario_c_empty_result_safe_vs_hallucinated():
    """
    SCENARIO C: Empty Result Guard
    Question: "Show students with attendance above 100%"
    Database: 0 rows
    """
    # Case C1: Grounded safe response
    grounded_ans = "No matching records were found in the database for your query."
    res_safe = AnswerVerifier.verify_answer(
        user_query="Show students with attendance above 100%",
        sql_query="SELECT name FROM students JOIN attendance WHERE attendance_percentage > 100",
        columns=["name", "attendance_percentage"],
        rows=[],
        row_count=0,
        generated_answer=grounded_ans,
        database_id="college_records"
    )
    assert res_safe["grounded"] is True
    assert res_safe["reliability_score"] >= 90
    assert res_safe["status"] == "VERIFIED"

    # Case C2: Hallucinated response on empty database result
    hallucinated_ans = "Found 2 students with attendance above 100%: **Arun** (105%) and **Divya** (102%)."
    res_hallucination = AnswerVerifier.verify_answer(
        user_query="Show students with attendance above 100%",
        sql_query="SELECT name FROM students JOIN attendance WHERE attendance_percentage > 100",
        columns=["name", "attendance_percentage"],
        rows=[],
        row_count=0,
        generated_answer=hallucinated_ans,
        database_id="college_records"
    )
    assert res_hallucination["grounded"] is False
    assert res_hallucination["reliability_score"] <= 20
    assert res_hallucination["status"] == "UNVERIFIED"
    assert "Hallucination Detected" in res_hallucination["reason"]


def test_scenario_d_numeric_mismatch():
    """
    SCENARIO D: Numeric Value Mismatch
    Database: Arun = 96.0%
    Answer: "Arun has 89% attendance."
    Expected: Detect numeric mismatch (89.0 not in DB).
    """
    rows = [{"name": "Arun", "attendance_percentage": 96.0}]
    columns = ["name", "attendance_percentage"]
    
    res = AnswerVerifier.verify_answer(
        user_query="Who has the highest attendance?",
        sql_query="SELECT name, attendance_percentage FROM students ...",
        columns=columns,
        rows=rows,
        row_count=1,
        generated_answer="**Arun** has 89% attendance.",
        database_id="college_records"
    )

    assert res["grounded"] is False
    assert res["status"] in ["UNVERIFIED", "NEEDS REVIEW"]
    assert res["checks"]["numeric_consistency"]["passed"] is False
    assert 89.0 in res["checks"]["numeric_consistency"]["unmatched_numbers"]


def test_scenario_e_safe_normal_query():
    """
    SCENARIO E: Safe Normal Query
    Question: "How many students are in the AI department?"
    Database: 5 students
    Answer: "**Artificial Intelligence and Data Science** has **5** students."
    Expected: Status VERIFIED, score >= 90.
    """
    rows = [{"dept_name": "Artificial Intelligence and Data Science", "student_count": 5}]
    columns = ["dept_name", "student_count"]
    
    res = AnswerVerifier.verify_answer(
        user_query="How many students are in the AI department?",
        sql_query="SELECT dept_name, COUNT(s.student_id) as student_count ...",
        columns=columns,
        rows=rows,
        row_count=1,
        generated_answer="**Artificial Intelligence and Data Science** has **5** students.",
        database_id="college_records"
    )

    assert res["grounded"] is True
    assert res["reliability_score"] >= 90
    assert res["status"] == "VERIFIED"


def test_entity_hallucination_unseen_person():
    """Tests detection when answer mentions a person not in the returned rows."""
    rows = [{"name": "Arun", "cgpa": 9.85}, {"name": "Divya", "cgpa": 9.62}]
    columns = ["name", "cgpa"]
    
    res = AnswerVerifier.verify_answer(
        user_query="Top students",
        sql_query="SELECT name, cgpa FROM students LIMIT 2",
        columns=columns,
        rows=rows,
        row_count=2,
        generated_answer="The top students are **Johnathan** and **Arun**.",
        database_id="college_records"
    )
    
    assert res["grounded"] is False
    assert res["checks"]["entity_consistency"]["passed"] is False


# ==============================================================================
# 2. Integration Tests with /api/query and /api/query/verify
# ==============================================================================

@pytest.mark.anyio
async def test_api_query_end_to_end_verification():
    """Tests the full API query flow returning verification telemetry and trust pipeline."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/query", json={
            "question": "Show me the top 5 students with highest CGPA",
            "database_id": "college_records",
            "provider": "offline"
        })
        assert res.status_code == 200
        data = res.json()
        
        # Verify existing fields preserved
        assert data["is_safe"] is True
        assert data["row_count"] == 5
        assert len(data["rows"]) == 5
        assert "Arun" in data["natural_answer"]
        
        # Verify new verification schema
        assert "verification" in data
        verif = data["verification"]
        assert verif["status"] in ["VERIFIED", "MOSTLY VERIFIED"]
        assert verif["grounded"] is True
        assert verif["reliability_score"] >= 85
        assert len(verif["evidence"]) > 0
        assert verif["verification_latency_ms"] >= 0
        
        # Verify trust pipeline steps
        assert "trust_pipeline" in data
        assert len(data["trust_pipeline"]) == 7
        step_names = [s["name"] for s in data["trust_pipeline"]]
        assert "Question Analyzed" in step_names
        assert "SQL Query Generated" in step_names
        assert "SQL Security Verified" in step_names
        assert "Database Executed" in step_names
        assert "AI Answer Synthesized" in step_names
        assert "Hallucination Checked" in step_names
        assert "Final Response Delivered" in step_names


@pytest.mark.anyio
async def test_api_query_simulate_hallucination():
    """Tests simulating an unsupported answer via the API query endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/query", json={
            "question": "Show me the top 5 students with highest CGPA",
            "database_id": "college_records",
            "provider": "offline",
            "simulate_answer": "**Arun** has CGPA 9.85 and is the best student in the college with 100% scholarship."
        })
        assert res.status_code == 200
        data = res.json()
        assert data["verification"]["grounded"] is False
        assert data["verification"]["status"] in ["UNVERIFIED", "NEEDS REVIEW"]
        assert data["verification"]["reliability_score"] < 70


@pytest.mark.anyio
async def test_api_dedicated_verify_endpoint():
    """Tests the /api/query/verify endpoint directly."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/query/verify", json={
            "question": "Show me the top 5 students with highest CGPA",
            "generated_answer": "**Arun** has CGPA 9.85 and **Divya** has CGPA 9.62.",
            "database_id": "college_records"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["grounded"] is True
        assert data["status"] == "VERIFIED"
        assert data["reliability_score"] >= 90


@pytest.mark.anyio
async def test_hallucination_benchmarks_and_candidate_test():
    """Tests the /api/hallucination endpoints: benchmarks, test-candidate, and telemetry."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Benchmarks
        bench_res = await ac.get("/api/hallucination/benchmarks")
        assert bench_res.status_code == 200
        b_data = bench_res.json()
        assert b_data["total_scenarios"] >= 6
        assert len(b_data["scenarios"]) >= 6

        # 2. Test candidate with blatant hallucination
        test_res = await ac.post("/api/hallucination/test-candidate", json={
            "question": "Who has the highest attendance?",
            "database_id": "college_records",
            "candidate_answer": "Arun has 96% attendance and is the best student in the college with 100% scholarship."
        })
        assert test_res.status_code == 200
        t_data = test_res.json()
        assert t_data["is_grounded"] is False
        assert t_data["hallucination_detected"] is True
        assert t_data["hallucination_risk_pct"] > 30
        assert len(t_data["claims_breakdown"]) > 0

        # 3. Telemetry
        telem_res = await ac.get("/api/hallucination/telemetry")
        assert telem_res.status_code == 200
        telem_data = telem_res.json()
        assert "hallucination_prevention_rate" in telem_data
        assert len(telem_data["active_defense_layers"]) >= 5


@pytest.mark.anyio
async def test_row_count_claim_valid_and_mismatch():
    """Tests distinguishing row count claims from entity hallucination."""
    rows = [
        {"section": "A", "tutor_name": "Mrs. Raashma"},
        {"section": "B", "tutor_name": "Mrs. Malathi Sundaram"},
        {"section": "C", "tutor_name": "Dr. Kavitha Chandran"}
    ]
    cols = ["section", "tutor_name"]

    # Valid row count claim
    res_valid = AnswerVerifier.verify_answer(
        user_query="List the tutors",
        sql_query="SELECT section, tutor_name FROM sections",
        columns=cols,
        rows=rows,
        row_count=3,
        generated_answer="Found **3** tutor records matching your query."
    )
    assert res_valid["grounded"] is True
    assert res_valid["status"] == "VERIFIED"
    assert res_valid["reliability_score"] >= 90
    assert res_valid["checks"]["entity_consistency"]["passed"] is True

    # Mismatched row count claim
    res_mismatch = AnswerVerifier.verify_answer(
        user_query="List the tutors",
        sql_query="SELECT section, tutor_name FROM sections",
        columns=cols,
        rows=rows,
        row_count=3,
        generated_answer="Found 12 tutor records matching your query."
    )
    assert res_mismatch["grounded"] is False
    assert res_mismatch["status"] in ["UNVERIFIED", "NEEDS REVIEW"]
    assert "Answer claims 12 records but the database returned 3" in res_mismatch["reason"]

