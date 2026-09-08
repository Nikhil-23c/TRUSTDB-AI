"""
Offline Heuristic & Rule-Based NL2SQL Engine.
Provides high-accuracy zero-shot SQL generation, intent detection, and entity extraction
without requiring external LLM API keys. Works for both built-in databases and custom/CSV tables.
"""

import re
from typing import Dict, Any, Tuple, Optional, List

class OfflineNLEngine:
    @staticmethod
    def analyze_and_generate(user_query: str, schema_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts intent, entities, and generates SQL query matching the database schema.
        Intelligently joins related tables to always include human-readable names.
        """
        q_raw = (user_query or "").strip()
        q_lower = q_raw.lower()
        tables = schema_data.get("tables", []) if schema_data else []
        table_map = {t["name"].lower(): t for t in tables}
        
        # 1. Detect Limit (e.g., "top 5", "first 10", "top 3", "limit 20")
        limit = None
        limit_match = re.search(r'\b(?:top|first|limit)\s+(\d+)\b', q_lower)
        if limit_match:
            limit = int(limit_match.group(1))

        # Check for alphabetical / name sorting
        is_alphabetical = any(k in q_lower for k in ["alphabetical", "a to z", "a-z", "sort by name", "ordered by name", "order by name"])

        # -------------------------------------------------------------
        # 2. Domain-Specific Fast Paths for Pre-built Databases
        # -------------------------------------------------------------
        
        # A. College Records
        if "students" in table_map and "departments" in table_map:
            # Pattern: List all students / names in alphabetical order / student names
            if ("student" in q_lower or "name" in q_lower or "all" in q_lower) and (is_alphabetical or "list" in q_lower or "show" in q_lower or "who are" in q_lower) and "attendance" not in q_lower and "cgpa" not in q_lower and "faculty" not in q_lower and "department" not in q_lower:
                lim = limit if limit else 25
                order = "ORDER BY s.name ASC" if is_alphabetical or "alphabetical" in q_lower or "name" in q_lower else "ORDER BY s.student_id ASC"
                return {
                    "intent": "List Students by Name",
                    "entities": ["Students", "Names", "Departments"],
                    "limit": lim,
                    "sort_by": "Name ASC" if "name" in order else None,
                    "sql": f"""SELECT s.student_id, s.name, s.email, d.dept_name, s.cgpa, s.year 
FROM students s 
LEFT JOIN departments d ON s.dept_id = d.dept_id 
{order} LIMIT {lim};"""
                }

            # Pattern: Top N students with highest CGPA
            if ("cgpa" in q_lower or "gpa" in q_lower or "rank" in q_lower or "topper" in q_lower or "best" in q_lower) and ("top" in q_lower or "highest" in q_lower or "order" in q_lower or "best" in q_lower):
                lim = limit if limit else 5
                return {
                    "intent": "Get Top Records",
                    "entities": ["Students", "CGPA"],
                    "limit": lim,
                    "sort_by": "CGPA Desc",
                    "sql": f"SELECT name, cgpa FROM students ORDER BY cgpa DESC LIMIT {lim};"
                }

            # Pattern: Attendance with student names
            if "attendance" in q_lower:
                thresh_match = re.search(r'(\d+)', q_lower)
                threshold = int(thresh_match.group(1)) if (thresh_match and any(k in q_lower for k in ["less", "below", "under", "<", "shortage", "low"])) else (75 if any(k in q_lower for k in ["less", "below", "under", "<", "shortage", "low"]) else None)
                
                where_clause = f"WHERE a.attendance_percentage < {threshold}" if threshold else ""
                order_clause = "ORDER BY s.name ASC" if is_alphabetical else ("ORDER BY a.attendance_percentage ASC" if threshold else "ORDER BY a.attendance_percentage DESC")
                lim_clause = f"LIMIT {limit}" if limit else "LIMIT 15"
                
                return {
                    "intent": "Student Attendance Overview",
                    "entities": ["Students", "Attendance", "Names"],
                    "limit": limit or 15,
                    "sort_by": "Name ASC" if is_alphabetical else "Attendance Percentage",
                    "sql": f"""SELECT s.name, s.email, a.attendance_percentage, a.attended_classes, a.total_classes 
FROM students s 
JOIN attendance a ON s.student_id = a.student_id 
{where_clause} 
{order_clause} {lim_clause};"""
                }

            # Pattern: Average CGPA per department
            if "department" in q_lower and ("average" in q_lower or "avg" in q_lower or "mean" in q_lower) and ("cgpa" in q_lower or "gpa" in q_lower or "score" in q_lower):
                return {
                    "intent": "Aggregation Group By",
                    "entities": ["Departments", "Students", "Average CGPA"],
                    "limit": None,
                    "sort_by": "Average CGPA DESC",
                    "sql": """SELECT d.dept_name, COUNT(s.student_id) as total_students, ROUND(AVG(s.cgpa), 2) as average_cgpa 
FROM departments d 
JOIN students s ON d.dept_id = s.dept_id 
GROUP BY d.dept_name 
ORDER BY average_cgpa DESC;"""
                }

            # Pattern: Department with student counts
            if "department" in q_lower and ("count" in q_lower or "how many" in q_lower or "most students" in q_lower or "number of students" in q_lower or "students per" in q_lower):
                return {
                    "intent": "Aggregation Count",
                    "entities": ["Departments", "Student Count"],
                    "limit": limit,
                    "sort_by": "Student Count DESC",
                    "sql": """SELECT d.dept_name, COUNT(s.student_id) as student_count 
FROM departments d 
JOIN students s ON d.dept_id = s.dept_id 
GROUP BY d.dept_name 
ORDER BY student_count DESC;"""
                }

            # Pattern: List faculty by salary or department
            if "faculty" in q_lower or "professor" in q_lower or "teacher" in q_lower or "salary" in q_lower:
                order_col = "f.name ASC" if is_alphabetical else "f.salary DESC"
                return {
                    "intent": "Filter and Sort Records",
                    "entities": ["Faculty", "Salary", "Experience"],
                    "limit": limit or 10,
                    "sort_by": "Name ASC" if is_alphabetical else "Salary DESC",
                    "sql": f"""SELECT f.name, f.designation, d.dept_name, f.salary, f.experience_years 
FROM faculty f 
JOIN departments d ON f.dept_id = d.dept_id 
ORDER BY {order_col} LIMIT {limit or 10};"""
                }

            # Pattern: All courses offered with department names
            if "course" in q_lower or "subject" in q_lower:
                order_col = "c.course_name ASC" if is_alphabetical else "c.course_id ASC"
                return {
                    "intent": "List Courses",
                    "entities": ["Courses", "Credits", "Departments"],
                    "limit": limit or 15,
                    "sort_by": None,
                    "sql": f"""SELECT c.course_id, c.course_name, d.dept_name, c.credits, c.semester 
FROM courses c 
JOIN departments d ON c.dept_id = d.dept_id 
ORDER BY {order_col} LIMIT {limit or 15};"""
                }

            # Pattern: Search for a specific student name
            name_match = re.search(r'\b(?:student|student named|about|details of|named|for)\s+([a-zA-Z]+)\b', q_lower)
            if name_match and "attendance" not in q_lower:
                name_query = name_match.group(1).capitalize()
                return {
                    "intent": "Filter by Entity Name",
                    "entities": ["Students", f"Name: {name_query}"],
                    "limit": 1,
                    "sort_by": None,
                    "sql": f"""SELECT s.student_id, s.name, s.email, d.dept_name, s.cgpa, s.year 
FROM students s 
LEFT JOIN departments d ON s.dept_id = d.dept_id 
WHERE s.name LIKE '%{name_query}%';"""
                }

        # B. E-Commerce Store
        if "products" in table_map and "orders" in table_map:
            # Pattern: Top selling or highest priced products
            if "product" in q_lower or "price" in q_lower or "expensive" in q_lower or "cost" in q_lower or "stock" in q_lower or "rating" in q_lower:
                lim = limit if limit else 5
                sort_clause = "name ASC" if is_alphabetical else ("rating DESC" if ("rating" in q_lower or "rated" in q_lower) else "price DESC")
                return {
                    "intent": "Get Top Products",
                    "entities": ["Products", "Price", "Rating"],
                    "limit": lim,
                    "sort_by": sort_clause,
                    "sql": f"SELECT name, price, stock_quantity, rating FROM products ORDER BY {sort_clause} LIMIT {lim};"
                }

            # Pattern: Total sales or orders with customer names
            if "order" in q_lower or "sale" in q_lower or "revenue" in q_lower:
                if "customer" in q_lower or "name" in q_lower:
                    return {
                        "intent": "Orders with Customer Names",
                        "entities": ["Orders", "Customers", "Revenue"],
                        "limit": limit or 10,
                        "sort_by": "Order Date DESC",
                        "sql": """SELECT o.order_id, c.name as customer_name, c.email, o.total_amount, o.status, o.order_date 
FROM orders o 
JOIN customers c ON o.customer_id = c.customer_id 
ORDER BY o.order_date DESC LIMIT 10;"""
                    }
                return {
                    "intent": "Order Summary & Revenue",
                    "entities": ["Orders", "Total Amount"],
                    "limit": None,
                    "sort_by": "Total Revenue DESC",
                    "sql": """SELECT status, COUNT(order_id) as total_orders, ROUND(SUM(total_amount), 2) as total_revenue 
FROM orders 
GROUP BY status;"""
                }

            # Pattern: Customers
            if "customer" in q_lower or "tier" in q_lower or "membership" in q_lower:
                if is_alphabetical or "name" in q_lower or "list" in q_lower:
                    return {
                        "intent": "List Customers by Name",
                        "entities": ["Customers", "Membership"],
                        "limit": limit or 15,
                        "sort_by": "Name ASC",
                        "sql": "SELECT name, email, membership_tier, total_spent, city FROM customers ORDER BY name ASC LIMIT 15;"
                    }
                return {
                    "intent": "Customer Distribution",
                    "entities": ["Customers", "Membership Tier"],
                    "limit": None,
                    "sort_by": "Customer Count DESC",
                    "sql": "SELECT membership_tier, COUNT(customer_id) as customer_count FROM customers GROUP BY membership_tier;"
                }

        # C. Healthcare
        if "patients" in table_map and "doctors" in table_map:
            # Pattern: Doctors by specialization or experience
            if "doctor" in q_lower or "specialization" in q_lower or "fee" in q_lower or "experience" in q_lower:
                order_col = "d.name ASC" if is_alphabetical else "d.experience_years DESC"
                return {
                    "intent": "List Doctors",
                    "entities": ["Doctors", "Specialization", "Experience"],
                    "limit": limit or 10,
                    "sort_by": "Name ASC" if is_alphabetical else "Experience DESC",
                    "sql": f"""SELECT d.name, d.specialization, dep.dept_name, d.consultation_fee, d.experience_years 
FROM doctors d 
JOIN departments dep ON d.dept_id = dep.dept_id 
ORDER BY {order_col} LIMIT {limit or 10};"""
                }

            # Pattern: Patients
            if "patient" in q_lower:
                if is_alphabetical or "name" in q_lower or "list" in q_lower:
                    return {
                        "intent": "List Patients by Name",
                        "entities": ["Patients", "Names"],
                        "limit": limit or 15,
                        "sort_by": "Name ASC",
                        "sql": "SELECT name, age, gender, blood_group, contact FROM patients ORDER BY name ASC LIMIT 15;"
                    }
                if "blood" in q_lower:
                    return {
                        "intent": "Patient Demographics",
                        "entities": ["Patients", "Blood Group"],
                        "limit": None,
                        "sort_by": "Patient Count DESC",
                        "sql": "SELECT blood_group, COUNT(patient_id) as patient_count FROM patients GROUP BY blood_group;"
                    }

            # Pattern: Billings with Patient Names
            if "bill" in q_lower or "payment" in q_lower or "amount" in q_lower:
                if "patient" in q_lower or "name" in q_lower:
                    return {
                        "intent": "Billings with Patient Names",
                        "entities": ["Billings", "Patients", "Amounts"],
                        "limit": limit or 10,
                        "sort_by": "Amount DESC",
                        "sql": """SELECT b.bill_id, p.name as patient_name, b.amount, b.payment_status, b.bill_date 
FROM billings b 
JOIN patients p ON b.patient_id = p.patient_id 
ORDER BY b.amount DESC LIMIT 10;"""
                    }
                return {
                    "intent": "Billing Summary",
                    "entities": ["Billings", "Payment Status"],
                    "limit": None,
                    "sort_by": "Total Amount DESC",
                    "sql": "SELECT payment_status, COUNT(bill_id) as bill_count, ROUND(SUM(amount), 2) as total_amount FROM billings GROUP BY payment_status;"
                }

        # -------------------------------------------------------------
        # 3. Smart Schema-Aware Generic Parser for Any Table / CSV
        # -------------------------------------------------------------
        if not tables:
            return {
                "intent": "Empty Database",
                "entities": [],
                "limit": None,
                "sort_by": None,
                "sql": "SELECT 1 WHERE 1=0;"
            }

        # 3.1 Check if query asks for names or people, prioritize table with 'name' column
        matched_table = None
        if "name" in q_lower or "people" in q_lower or is_alphabetical:
            for t in tables:
                col_names = [c["name"].lower() for c in t.get("columns", [])]
                if "name" in col_names or any("name" in cn for cn in col_names):
                    matched_table = t
                    break

        if not matched_table:
            for t in tables:
                t_name = t["name"].lower()
                if t_name in q_lower or t_name.rstrip('s') in q_lower or t_name + 's' in q_lower:
                    matched_table = t
                    break
        
        target_table = matched_table if matched_table else tables[0]
        table_name = target_table["name"]
        columns = target_table.get("columns", [])

        # Categorize columns
        numeric_cols = []
        text_cols = []
        date_cols = []
        name_col = None
        for col in columns:
            c_name = col["name"]
            c_type = str(col.get("type", "")).upper()
            if "name" in c_name.lower():
                name_col = c_name
            if any(num_type in c_type for num_type in ["INT", "REAL", "FLOAT", "DOUBLE", "NUMERIC", "DECIMAL"]):
                if not col.get("is_primary_key") and not c_name.endswith("_id") and c_name != "id":
                    numeric_cols.append(c_name)
            elif any(d_type in c_type for d_type in ["DATE", "TIME"]):
                date_cols.append(c_name)
            else:
                if not col.get("is_primary_key"):
                    text_cols.append(c_name)

        # 3.2 Check for Aggregation Patterns
        is_count = any(k in q_lower for k in ["how many", "count", "number of", "total count"])
        is_avg = any(k in q_lower for k in ["average", "avg", "mean"])
        is_sum = any(k in q_lower for k in ["sum of", "total sum", "total revenue", "total amount", "total sales", "overall"])
        is_max = any(k in q_lower for k in ["max", "maximum", "highest", "topmost", "peak"])
        is_min = any(k in q_lower for k in ["min", "minimum", "lowest", "least", "cheapest"])

        # Check for matching column names in user query
        matched_col = None
        for col in columns:
            if col["name"].lower() in q_lower:
                matched_col = col["name"]
                break

        # Group-by categorical column if mentioned
        group_col = None
        for c in text_cols:
            if c.lower() in q_lower:
                group_col = c
                break

        # Aggregate SQL Generation
        if is_avg and (numeric_cols or matched_col):
            num_target = matched_col if matched_col in numeric_cols else (numeric_cols[0] if numeric_cols else columns[0]["name"])
            if group_col:
                return {
                    "intent": "Average Aggregation by Group",
                    "entities": [table_name, group_col, num_target],
                    "limit": None,
                    "sort_by": f"avg_{num_target} DESC",
                    "sql": f'SELECT "{group_col}", ROUND(AVG("{num_target}"), 2) as avg_{num_target} FROM "{table_name}" GROUP BY "{group_col}" ORDER BY avg_{num_target} DESC;'
                }
            return {
                "intent": "Average Calculation",
                "entities": [table_name, num_target],
                "limit": 1,
                "sort_by": None,
                "sql": f'SELECT ROUND(AVG("{num_target}"), 2) as average_{num_target} FROM "{table_name}";'
            }

        if is_sum and (numeric_cols or matched_col):
            num_target = matched_col if matched_col in numeric_cols else (numeric_cols[0] if numeric_cols else columns[0]["name"])
            if group_col:
                return {
                    "intent": "Sum Aggregation by Group",
                    "entities": [table_name, group_col, num_target],
                    "limit": None,
                    "sort_by": f"total_{num_target} DESC",
                    "sql": f'SELECT "{group_col}", ROUND(SUM("{num_target}"), 2) as total_{num_target} FROM "{table_name}" GROUP BY "{group_col}" ORDER BY total_{num_target} DESC;'
                }
            return {
                "intent": "Total Sum Calculation",
                "entities": [table_name, num_target],
                "limit": 1,
                "sort_by": None,
                "sql": f'SELECT ROUND(SUM("{num_target}"), 2) as total_{num_target} FROM "{table_name}";'
            }

        if is_count:
            if group_col:
                return {
                    "intent": "Count Aggregation by Group",
                    "entities": [table_name, group_col],
                    "limit": None,
                    "sort_by": "total_count DESC",
                    "sql": f'SELECT "{group_col}", COUNT(*) as total_count FROM "{table_name}" GROUP BY "{group_col}" ORDER BY total_count DESC;'
                }
            return {
                "intent": "Total Record Count",
                "entities": [table_name],
                "limit": 1,
                "sort_by": None,
                "sql": f'SELECT COUNT(*) as total_records FROM "{table_name}";'
            }

        # 3.3 Sorting & Ordering
        order_clause = ""
        sort_by_label = None
        if is_alphabetical and (name_col or text_cols):
            target_text = name_col if name_col else text_cols[0]
            order_clause = f' ORDER BY "{target_text}" ASC'
            sort_by_label = f"{target_text} ASC"
        elif is_max or any(k in q_lower for k in ["top", "highest", "best", "greatest", "desc"]):
            target_num = matched_col if matched_col in numeric_cols else (numeric_cols[0] if numeric_cols else None)
            if target_num:
                order_clause = f' ORDER BY "{target_num}" DESC'
                sort_by_label = f"{target_num} DESC"
        elif is_min or any(k in q_lower for k in ["lowest", "least", "bottom", "worst", "asc", "cheapest"]):
            target_num = matched_col if matched_col in numeric_cols else (numeric_cols[0] if numeric_cols else None)
            if target_num:
                order_clause = f' ORDER BY "{target_num}" ASC'
                sort_by_label = f"{target_num} ASC"

        # 3.4 Filter conditions (e.g., > 100, < 50, = "XYZ")
        where_clause = ""
        comp_match = re.search(r'([><=]=?)\s*([0-9]+(?:\.[0-9]+)?)', q_lower)
        if comp_match and numeric_cols:
            op = comp_match.group(1)
            val = comp_match.group(2)
            target_num = matched_col if matched_col in numeric_cols else numeric_cols[0]
            where_clause = f' WHERE "{target_num}" {op} {val}'

        lim_clause = f" LIMIT {limit}" if limit else " LIMIT 15"
        generated_sql = f'SELECT * FROM "{table_name}"{where_clause}{order_clause}{lim_clause};'

        return {
            "intent": "Schema Heuristic Query",
            "entities": [table_name],
            "limit": limit or 15,
            "sort_by": sort_by_label,
            "sql": generated_sql
        }


