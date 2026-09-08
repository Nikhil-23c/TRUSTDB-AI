"""
Answer Delivery & Grounded Natural Language Summarizer.
Transforms structured SQL result rows and metadata into crisp, human-readable,
fully grounded conversational answers strictly derived from database evidence.
"""

from typing import List, Dict, Any, Optional

class ResultSummarizer:
    @staticmethod
    def generate_summary(
        user_query: str,
        sql_query: str,
        columns: List[str],
        rows: List[Dict[str, Any]],
        intent: Optional[str] = None
    ) -> str:
        """
        Generates a clear natural language answer strictly grounded in query results.
        """
        row_count = len(rows)
        if row_count == 0:
            return "No matching records were found in the database for your query."

        q_low = user_query.lower()

        # Case 1: Single value aggregate (e.g. COUNT(*), AVG(cgpa), SUM(amount))
        if row_count == 1 and len(columns) == 1:
            col_name = columns[0]
            val = rows[0][col_name]
            clean_col = col_name.replace("_", " ").title()
            return f"The {clean_col} is **{val}**."

        # Case 2: Specific Single Row with Name & Metric (e.g., "Who has highest attendance?" or "Student details")
        if row_count == 1:
            row = rows[0]
            # Check for department count
            if "dept_name" in row and ("student_count" in row or "total_students" in row):
                count_val = row.get("student_count", row.get("total_students"))
                return f"**{row['dept_name']}** has **{count_val}** students."

            # Check for highest / top single record
            if ("highest" in q_low or "top" in q_low or "best" in q_low or "who" in q_low) and "name" in row:
                # Prioritize numeric columns or metric columns
                metric_col = next((c for c in columns if c != "name" and not c.endswith("_id") and c != "id" and isinstance(row.get(c), (int, float))), None)
                if not metric_col:
                    metric_col = next((c for c in columns if c != "name" and not c.endswith("_id") and c != "id" and any(k in c.lower() for k in ["attendance", "cgpa", "salary", "amount", "price", "rating", "count", "score", "marks"])), None)
                
                if metric_col:
                    val = row[metric_col]
                    val_str = f"{val}%" if "percentage" in metric_col or "%" in str(val) else f"{val}"
                    metric_label = metric_col.replace("_percentage", "").replace("_", " ")
                    return f"**{row['name']}** has the highest {metric_label} at **{val_str}**."

            name_key = next((k for k in ["name", "student_name", "dept_name", "category_name", "product_name"] if k in row), None)
            if name_key:
                details = ", ".join([f"**{k.replace('_', ' ').title()}**: {v}" for k, v in row.items() if k != name_key and v is not None])
                return f"Details for **{row[name_key]}**: {details}."
            else:
                details = ", ".join([f"**{k.replace('_', ' ').title()}**: {v}" for k, v in row.items() if v is not None])
                return f"Result: {details}."

        # Case 3: Top N ranking (e.g., Top 5 students with highest CGPA or attendance)
        if ("top" in q_low or "highest" in q_low or "best" in q_low or intent == "Get Top Records") and ("name" in columns):
            metric_col = next((c for c in columns if c != "name" and not c.endswith("_id") and c != "id" and isinstance(rows[0].get(c), (int, float))), None)
            if not metric_col:
                metric_col = next((c for c in columns if c != "name" and not c.endswith("_id") and c != "id" and any(k in c.lower() for k in ["attendance", "cgpa", "salary", "amount", "price", "rating", "count", "score", "marks"])), columns[-1])
            metric_label = metric_col.replace("_percentage", " percentage").replace("_", " ").upper()
            items = []
            for i, r in enumerate(rows, 1):
                name = r.get("name", "Unknown")
                score = r.get(metric_col, "")
                items.append(f"{i}. **{name}** ({score})")
            
            return f"Here are the top {row_count} records with the highest {metric_label}:\n\n" + "\n".join(items)

        # Case 4: Multi-metric Group Aggregations (e.g., departments with student counts and average CGPA)
        if len(columns) >= 2 and any(isinstance(rows[0].get(c), (int, float)) for c in columns[1:]):
            name_candidates = [c for c in columns if "name" in c.lower()]
            text_candidates = [c for c in columns if not c.endswith("_id") and c != "id" and isinstance(rows[0].get(c), str)]
            
            if name_candidates:
                label_col = name_candidates[0]
            elif text_candidates:
                label_col = text_candidates[0]
            else:
                label_col = columns[0]

            metric_cols = [c for c in columns if c != label_col and not c.endswith("_id") and c != "id"]
            if metric_cols:
                summary_items = []
                for r in rows[:7]:
                    m_strs = [f"{c.replace('_', ' ').title()}: **{r.get(c)}**" for c in metric_cols if r.get(c) is not None]
                    label_val = r.get(label_col, "Record")
                    summary_items.append(f"• **{label_val}** ({', '.join(m_strs)})")
                more = f"\n...and {row_count - 7} more" if row_count > 7 else ""
                return f"Breakdown across **{label_col.replace('_', ' ').title()}**:\n\n" + "\n".join(summary_items) + more

        # Case 5: General multi-row summary
        name_col = next((c for c in columns if "name" in c.lower()), None)
        if name_col and row_count <= 10:
            names = [f"**{r.get(name_col)}**" for r in rows if r.get(name_col)]
            if names:
                return f"Found **{row_count}** matching records: {', '.join(names)}. Full details are displayed in the interactive grid."

        return f"Found **{row_count}** matching records for your query. The details are displayed in the interactive grid."
