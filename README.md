# NEURA X — Trusted AI Database Assistant (PS7 + PS2)
**Autonomous Database Question-Answering with Active Hallucination Verification**

---

## 🌟 Overview

**Neura-X** is an enterprise AI database assistant that converts natural-language questions into safe, validated database queries and **verifies every AI-generated answer against the actual database results before presenting it to the user**.

By merging database question answering (**PS7**) with a dedicated hallucination-prevention layer (**PS2**), Neura-X guarantees that the AI **never invents facts, numbers, or entities** that are unsupported by the database ground truth.

---

## 🛡️ The 7-Stage Trust Pipeline

```
USER QUESTION
      │
      ▼
1. INTENT & ENTITY PARSER ──────────► Extracts targets & schema constraints
      │
      ▼
2. NL → SQL GENERATION    ──────────► Schema-aware read-only SQL generation
      │
      ▼
3. SQL SECURITY GUARDRAIL ──────────► Blocks DDL/DML, prevents injection, clamps LIMIT
      │
      ▼
4. DATABASE EXECUTION     ──────────► Runs query against local SQLite / PostgreSQL / CSV
      │
      ▼
5. GROUND TRUTH EVIDENCE  ──────────► Extracts actual returned rows & column metrics
      │
      ▼
6. GROUNDING VERIFICATION ──────────► Hybrid verification (Deterministic + Semantic Auditor)
      │
      ├───── Unverified / Unsupported Claim ─────► FLAGGED (Score < 70, Reason & Evidence shown)
      │
      └───── 100% Grounded in DB Results    ─────► VERIFIED (Score 90-100, Trusted Answer)
      │
      ▼
7. FINAL TRUSTED RESPONSE ──────────► Conversational Answer + Reliability Meter + Visualizations
```

---

## 🔬 Hybrid Hallucination Verification Layer

Neura-X employs a **two-tier hybrid verification architecture** to ensure maximum reliability and sub-millisecond latency:

### Layer 1: Deterministic Verification (Fast Path, <2ms)
- **Numeric Consistency**: Extracts all numbers, percentages, and currencies from the AI answer and verifies that every value exists in the returned dataset.
- **Entity & Name Consistency**: Validates that all names, products, and departments mentioned in the answer actually exist in the result rows.
- **Empty Result Guard**: If the database returns 0 rows, asserts that the answer correctly reports no records and did not invent data.
- **Aggregate Verification**: Confirms that mathematical aggregations (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) match the executed result.
- **Unsupported Superlative Detector**: Flags speculative qualitative claims (e.g. claiming a student is "the top-performing student in the college" when only attendance was queried).

### Layer 2: Semantic Auditor (Slow Path / Ambiguous Claims)
- Invokes an adversarial LLM auditor when ambiguous claims or external LLM connections are active.
- Ground truth is strictly restricted to the raw database JSON result.
- Outside knowledge is strictly prohibited.

---

## 📊 Reliability Score Interpretation

Neura-X provides a clear confidence indicator from **0 to 100**:

| Score Range | Status | Interpretation | Action |
|---|---|---|---|
| **90 – 100** | `VERIFIED` | 100% grounded in database evidence | Displayed with green badge |
| **70 – 89** | `MOSTLY VERIFIED` | Supported with minor stylistic phrasing | Displayed with cyan badge |
| **40 – 69** | `NEEDS REVIEW` | Contains claims or values not verifiable from result | Displayed with amber alert |
| **0 – 39** | `UNVERIFIED` | Hallucination, numeric mismatch, or unsupported facts | Flagged with red warning |

---

## 🎯 5 Core Hackathon Demonstration Scenarios

| Scenario | Question / Test Case | Database Result | AI Answer | Outcome & Status |
|---|---|---|---|---|
| **Scenario A** (Verified) | *"Who has the highest attendance?"* | Arun = 96%, Divya = 94%, Karthik = 91% | *"Arun has the highest attendance at 96%."* | 🟢 **`VERIFIED`** (Score: 96/100) |
| **Scenario B** (Hallucination) | *"Who has the highest attendance?"* | Arun = 96% | *"Arun has 96% attendance and is the top-performing student in the college."* | 🔴 **`UNVERIFIED`** (Score: 38/100) — Unsupported claim flagged |
| **Scenario C** (Empty Result) | *"Show students with attendance above 100%"* | 0 rows returned | *"No matching records were found in the database."* | 🟢 **`VERIFIED`** (Score: 100/100) — Zero-row safe guard |
| **Scenario D** (Numeric Mismatch) | *"Who has the highest attendance?"* | Arun = 96% | *"Arun has 89% attendance."* | 🔴 **`UNVERIFIED`** (Score: 28/100) — Value 89.0% mismatch detected |
| **Scenario E** (Safe Query) | *"How many students are in the AI department?"* | 5 students | *"Artificial Intelligence and Data Science has 5 students."* | 🟢 **`VERIFIED`** (Score: 96/100) |

---

## 📡 API Reference

### `POST /api/query`
Main endpoint for question answering and grounding verification.

#### Request:
```json
{
  "question": "Who has the highest attendance?",
  "database_id": "college_records",
  "provider": "offline"
}
```

#### Response:
```json
{
  "question": "Who has the highest attendance?",
  "database_id": "college_records",
  "intent": "Student Attendance Overview",
  "generated_sql": "SELECT s.name, s.email, a.attendance_percentage...",
  "sanitized_sql": "SELECT s.name, s.email, a.attendance_percentage...",
  "is_safe": true,
  "columns": ["name", "email", "attendance_percentage", "attended_classes", "total_classes"],
  "rows": [
    {
      "name": "Arun",
      "email": "arun@college.edu",
      "attendance_percentage": 96.0,
      "attended_classes": 58,
      "total_classes": 60
    }
  ],
  "row_count": 1,
  "execution_time_ms": 1.45,
  "natural_answer": "**Arun** has the highest attendance at **96.0%**.",
  "verification": {
    "status": "VERIFIED",
    "grounded": true,
    "reliability_score": 96,
    "reason": "Answer is fully supported by the database results.",
    "evidence": ["Arun — Attendance Percentage: 96.0, Attended Classes: 58, Total Classes: 60"],
    "verification_latency_ms": 0.82
  },
  "security": {
    "status": "SAFE",
    "mode": "READ_ONLY_SANDBOX"
  },
  "trust_pipeline": [
    { "step_id": 1, "name": "Question Analyzed", "status": "SUCCESS" },
    { "step_id": 2, "name": "SQL Query Generated", "status": "SUCCESS" },
    { "step_id": 3, "name": "SQL Security Verified", "status": "SAFE" },
    { "step_id": 4, "name": "Database Executed", "status": "SUCCESS" },
    { "step_id": 5, "name": "AI Answer Synthesized", "status": "SUCCESS" },
    { "step_id": 6, "name": "Hallucination Checked", "status": "VERIFIED" },
    { "step_id": 7, "name": "Final Response Delivered", "status": "VERIFIED" }
  ],
  "verification_latency_ms": 0.82
}
```

### `POST /api/query/verify`
Dedicated verification endpoint to test any arbitrary text answer against a query result.

---

## 🏃 Quick Start

### 1. Launch Server (Windows)
Double-click `start.bat` or run:
```powershell
cd "D:\Neura X\backend"
python run.py
```
Open your browser at:
👉 **`http://localhost:8000`**

### 2. Run Automated Tests
```powershell
pytest -v
```
All unit and integration tests (29 tests) will run covering SQL safety, heuristic NL2SQL, hallucination detection, empty result guards, and API endpoints.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.9+, FastAPI, SQLAlchemy, SQLite, Pydantic, sqlparse, google-genai
- **Frontend**: React 18, Tailwind CSS, Chart.js, Lucide Icons, Web Speech API
- **Testing**: Pytest, HTTPX, AnyIO
