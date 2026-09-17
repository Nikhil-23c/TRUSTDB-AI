"""
Database Connection Manager and Schema Introspector.
Manages connections to SQLite, PostgreSQL, MySQL, and handles dynamic schema discovery.
"""

import os
import re
import time
import sqlite3
import csv
from typing import Dict, Any, List, Optional
from pathlib import Path
from sqlalchemy import create_engine, text, inspect
from app.config import SAMPLE_DATA_DIR, UPLOAD_DIR

class DatabaseManager:
    def __init__(self):
        self.databases: Dict[str, Dict[str, Any]] = {}
        self._init_default_databases()

    def _init_default_databases(self):
        """Register the built-in sample databases."""
        college_path = SAMPLE_DATA_DIR / "college_records.db"
        ecommerce_path = SAMPLE_DATA_DIR / "ecommerce_store.db"
        healthcare_path = SAMPLE_DATA_DIR / "healthcare.db"

        self.databases["college_records"] = {
            "id": "college_records",
            "name": "College & Student Records",
            "description": "Student CGPA, departments, courses, attendance, and faculty records.",
            "type": "sqlite",
            "uri": f"sqlite:///{college_path}",
            "file_path": str(college_path),
            "icon": "GraduationCap"
        }

        self.databases["ecommerce_store"] = {
            "id": "ecommerce_store",
            "name": "E-Commerce Online Store",
            "description": "Products, categories, customers, orders, and sales items.",
            "type": "sqlite",
            "uri": f"sqlite:///{ecommerce_path}",
            "file_path": str(ecommerce_path),
            "icon": "ShoppingCart"
        }

        self.databases["healthcare"] = {
            "id": "healthcare",
            "name": "Hospital & Healthcare Records",
            "description": "Patients, doctors, appointments, medical departments, and billings.",
            "type": "sqlite",
            "uri": f"sqlite:///{healthcare_path}",
            "file_path": str(healthcare_path),
            "icon": "Activity"
        }

        # Auto-discover uploaded/custom databases
        if UPLOAD_DIR.exists():
            for db_file in sorted(UPLOAD_DIR.glob("*.db"), key=os.path.getmtime, reverse=True):
                db_id = db_file.stem
                if db_id not in self.databases:
                    clean_name = re.sub(r"^csv_\d+_", "", db_id).replace("_", " ").title()
                    self.databases[db_id] = {
                        "id": db_id,
                        "name": f"CSV: {clean_name}",
                        "description": f"Custom uploaded database table '{clean_name}'.",
                        "type": "sqlite",
                        "uri": f"sqlite:///{db_file}",
                        "file_path": str(db_file),
                        "icon": "FileSpreadsheet"
                    }

    def list_databases(self) -> List[Dict[str, Any]]:
        """List all available registered databases."""
        return [
            {
                "id": db["id"],
                "name": db["name"],
                "description": db["description"],
                "type": db["type"],
                "icon": db.get("icon", "Database")
            }
            for db in self.databases.values()
        ]

    def register_custom_sqlite(self, db_id: str, name: str, file_path: str, description: str = "User uploaded SQLite database.") -> Dict[str, Any]:
        """Register an uploaded or external SQLite database."""
        self.databases[db_id] = {
            "id": db_id,
            "name": name,
            "description": description,
            "type": "sqlite",
            "uri": f"sqlite:///{file_path}",
            "file_path": file_path,
            "icon": "FileSpreadsheet"
        }
        return self.databases[db_id]

    def register_connection_uri(self, db_id: str, name: str, uri: str, db_type: str = "postgresql") -> Dict[str, Any]:
        """Register an external database connection string (PostgreSQL/MySQL/etc)."""
        self.databases[db_id] = {
            "id": db_id,
            "name": name,
            "description": f"External {db_type.upper()} database connection.",
            "type": db_type,
            "uri": uri,
            "icon": "Server"
        }
        return self.databases[db_id]

    def import_csv_to_sqlite(self, csv_file_path: str, table_name: str, db_name: Optional[str] = None) -> str:
        """Import a CSV file into a dedicated SQLite database with automatic type inference and return db_id."""
        clean_table_name = "".join([c if c.isalnum() else "_" for c in table_name]).strip("_") or "dataset"
        db_id = f"csv_{int(time.time())}_{clean_table_name.lower()}"
        sqlite_file = UPLOAD_DIR / f"{db_id}.db"
        
        with open(csv_file_path, mode='r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            headers = next(reader, None)
            if not headers:
                raise ValueError("CSV file is empty.")
            
            clean_headers = []
            seen_cols = set()
            for i, h in enumerate(headers):
                c = "".join([ch if ch.isalnum() else "_" for ch in h]).strip("_").lower() or f"col_{i+1}"
                if c in seen_cols:
                    c = f"{c}_{i+1}"
                seen_cols.add(c)
                clean_headers.append(c)
            
            rows = [row for row in reader if row]
            
            # Infer column types by inspecting rows
            col_types = []
            for col_idx in range(len(clean_headers)):
                values = [r[col_idx].strip() for r in rows if col_idx < len(r) and r[col_idx].strip() != ""]
                if not values:
                    col_types.append("TEXT")
                    continue
                
                # Check if all values are integer
                is_int = True
                is_real = True
                for v in values:
                    if not re.match(r'^-?\d+$', v):
                        is_int = False
                    if not re.match(r'^-?\d+(\.\d+)?$', v):
                        is_real = False
                
                if is_int:
                    col_types.append("INTEGER")
                elif is_real:
                    col_types.append("REAL")
                else:
                    col_types.append("TEXT")

            conn = sqlite3.connect(sqlite_file)
            cursor = conn.cursor()
            cols_def = ", ".join([f'"{col}" {t}' for col, t in zip(clean_headers, col_types)])
            cursor.execute(f'CREATE TABLE "{clean_table_name}" ({cols_def});')
            
            # Convert values to int/float where applicable
            formatted_rows = []
            for r in rows:
                row_vals = []
                for col_idx in range(len(clean_headers)):
                    if col_idx < len(r):
                        v_str = r[col_idx].strip()
                        if v_str == "":
                            row_vals.append(None)
                        elif col_types[col_idx] == "INTEGER":
                            try:
                                row_vals.append(int(v_str))
                            except ValueError:
                                row_vals.append(v_str)
                        elif col_types[col_idx] == "REAL":
                            try:
                                row_vals.append(float(v_str))
                            except ValueError:
                                row_vals.append(v_str)
                        else:
                            row_vals.append(v_str)
                    else:
                        row_vals.append(None)
                formatted_rows.append(row_vals)

            placeholders = ", ".join(["?"] * len(clean_headers))
            if formatted_rows:
                cursor.executemany(f'INSERT INTO "{clean_table_name}" VALUES ({placeholders})', formatted_rows)
            
            conn.commit()
            conn.close()

        self.register_custom_sqlite(
            db_id=db_id,
            name=f"CSV: {table_name}",
            file_path=str(sqlite_file),
            description=f"Auto-generated SQL table '{clean_table_name}' with {len(rows)} rows from CSV."
        )
        return db_id


    def get_engine(self, db_id: str):
        """Create or retrieve SQLAlchemy engine for given db_id."""
        if db_id not in self.databases:
            raise ValueError(f"Database '{db_id}' not found.")
        db_info = self.databases[db_id]
        return create_engine(db_info["uri"])

    def introspect_schema(self, db_id: str) -> Dict[str, Any]:
        """
        Extracts detailed schema metadata: tables, columns, types, keys, and row previews.
        """
        engine = self.get_engine(db_id)
        inspector = inspect(engine)
        
        table_names = inspector.get_table_names()
        schema_data = {
            "database_id": db_id,
            "database_name": self.databases[db_id]["name"],
            "tables": []
        }

        with engine.connect() as conn:
            for table_name in table_names:
                columns = inspector.get_columns(table_name)
                pk_constraint = inspector.get_pk_constraint(table_name)
                primary_keys = pk_constraint.get("constrained_columns", []) if pk_constraint else []
                foreign_keys = inspector.get_foreign_keys(table_name)

                # Get row count
                try:
                    count_res = conn.execute(text(f'SELECT COUNT(*) FROM "{table_name}"')).scalar()
                except Exception:
                    count_res = 0

                # Get sample 3 rows
                try:
                    sample_res = conn.execute(text(f'SELECT * FROM "{table_name}" LIMIT 3'))
                    sample_cols = list(sample_res.keys())
                    sample_rows = [dict(zip(sample_cols, row)) for row in sample_res.fetchall()]
                except Exception:
                    sample_rows = []

                fk_map = {}
                for fk in foreign_keys:
                    for constrained_col, referred_col in zip(fk.get("constrained_columns", []), fk.get("referred_columns", [])):
                        fk_map[constrained_col] = f"{fk.get('referred_table')}.{referred_col}"

                table_info = {
                    "name": table_name,
                    "row_count": count_res,
                    "columns": [
                        {
                            "name": col["name"],
                            "type": str(col["type"]),
                            "is_primary_key": col["name"] in primary_keys,
                            "foreign_key": fk_map.get(col["name"])
                        }
                        for col in columns
                    ],
                    "sample_rows": sample_rows
                }
                schema_data["tables"].append(table_info)

        return schema_data

    def get_schema_prompt_text(self, db_id: str) -> str:
        """
        Formats schema metadata into a concise, high-clarity context string for LLM prompts.
        """
        schema = self.introspect_schema(db_id)
        lines = [f"Database: {schema['database_name']} (SQLite/SQL Standard Dialect)\nSchema Definition:"]
        
        for table in schema["tables"]:
            cols_str = []
            for col in table["columns"]:
                col_desc = f"{col['name']} ({col['type']})"
                if col["is_primary_key"]:
                    col_desc += " [PRIMARY KEY]"
                if col["foreign_key"]:
                    col_desc += f" [REFERENCES {col['foreign_key']}]"
                cols_str.append(col_desc)
            
            lines.append(f"Table `{table['name']}` ({table['row_count']} rows):")
            lines.append("  Columns: " + ", ".join(cols_str))
            
            if table["sample_rows"]:
                lines.append(f"  Sample row: {table['sample_rows'][0]}")
            lines.append("")

        return "\n".join(lines)

    def execute_query(self, db_id: str, sql_query: str) -> Dict[str, Any]:
        """
        Executes a validated read-only SQL query and returns rows, columns, and timing metrics.
        """
        start_time = time.perf_counter()
        engine = self.get_engine(db_id)

        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            columns = list(result.keys())
            rows_raw = result.fetchall()
            
            # Convert rows to serializable dicts
            rows = [dict(zip(columns, row)) for row in rows_raw]
            
        execution_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "columns": columns,
            "rows": rows,
            "row_count": len(rows),
            "execution_time_ms": execution_time_ms,
            "query": sql_query
        }

# Global database manager instance
db_manager = DatabaseManager()
