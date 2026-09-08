import pytest
import tempfile
import os
from app.core.database_manager import db_manager
from app.core.chart_detector import ChartDetector
from app.core.summarizer import ResultSummarizer

def test_csv_import_and_type_inference():
    # Create temporary CSV with integer, real, and text columns
    csv_content = """product_name,category,price,units_sold
Gaming Laptop,Electronics,1299.99,45
Wireless Mouse,Electronics,29.50,320
Office Chair,Furniture,199.00,80
Desk Lamp,Furniture,35.00,150
"""
    with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False, encoding="utf-8") as f:
        f.write(csv_content)
        temp_path = f.name

    try:
        db_id = db_manager.import_csv_to_sqlite(temp_path, "test_sales")
        assert db_id in db_manager.databases
        
        schema = db_manager.introspect_schema(db_id)
        assert len(schema["tables"]) == 1
        table = schema["tables"][0]
        assert table["row_count"] == 4
        
        col_type_map = {c["name"]: c["type"] for c in table["columns"]}
        assert "TEXT" in col_type_map["product_name"].upper()
        assert "REAL" in col_type_map["price"].upper() or "NUMERIC" in col_type_map["price"].upper()
        assert "INTEGER" in col_type_map["units_sold"].upper() or "INT" in col_type_map["units_sold"].upper()

        # Test querying and chart detection on imported CSV table
        exec_res = db_manager.execute_query(db_id, 'SELECT product_name, units_sold FROM "test_sales" ORDER BY units_sold DESC;')
        assert exec_res["row_count"] == 4
        
        chart = ChartDetector.detect_and_build_chart(exec_res["columns"], exec_res["rows"])
        assert chart is not None
        assert chart["type"] == "bar"
        assert len(chart["data"]["labels"]) == 4

        # Test conversational summary
        summary = ResultSummarizer.generate_summary("Show sales", exec_res["query"], exec_res["columns"], exec_res["rows"])
        assert "Wireless Mouse" in summary or "4" in summary
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

def test_chart_detection_edge_cases():
    # Non-chartable data (only 1 column or empty)
    assert ChartDetector.detect_and_build_chart(["name"], [{"name": "A"}, {"name": "B"}]) is None
    assert ChartDetector.detect_and_build_chart([], []) is None
    
    # Pie candidate for category/status
    cols = ["status", "total_orders"]
    rows = [
        {"status": "Completed", "total_orders": 120},
        {"status": "Pending", "total_orders": 30},
        {"status": "Cancelled", "total_orders": 10}
    ]
    chart = ChartDetector.detect_and_build_chart(cols, rows)
    assert chart is not None
    assert chart["type"] == "doughnut"
