import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.anyio
async def test_live_query_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        test_cases = [
            ("Who has the highest attendance?", "Arun", 1, 90),
            ("list the tutor of section A", "Mrs. Raashma", 1, 90),
            ("Show students with attendance above 100%.", "No matching records", 0, 95),
            ("How many students are in the AI department?", "5", 1, 90)
        ]
        
        for q, expected_snippet, expected_row_count, min_reliability in test_cases:
            res = await ac.post("/api/query", json={
                "question": q,
                "database_id": "college_records",
                "provider": "offline"
            })
            assert res.status_code == 200
            data = res.json()
            
            # 1. Exact question matches
            assert data["question"] == q
            
            # 2. Answer matches expected snippet
            assert expected_snippet.lower() in data["natural_answer"].lower()
            
            # 3. Row count matches
            assert data["row_count"] == expected_row_count
            assert len(data["rows"]) == expected_row_count
            
            # 4. Verification matches
            assert data["verification"]["status"] == "VERIFIED"
            assert data["verification"]["reliability_score"] >= min_reliability
            assert len(data["verification"]["reason"]) > 0
            
            # 5. Non-empty results have correct dynamic columns
            if expected_row_count > 0:
                assert len(data["columns"]) > 0
                for col in data["columns"]:
                    assert col in data["rows"][0]
