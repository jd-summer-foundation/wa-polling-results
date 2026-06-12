"""Extract quantitative results from the ShelterWA accessible housing poll
crosstab workbook into JSON for the dashboard.

Usage: python3 scripts/extract_data.py <path-to-xlsx>
Writes docs/data.js (a JS file assigning the data to window.POLL_DATA so the
dashboard works when opened directly from disk as well as over HTTP).
"""
import json
import sys

import openpyxl

# Columns we expose in the dashboard: (sheet column index, group label)
SEGMENTS = {
    "overall": [(2, "Overall")],
    "age": [(5, "18–34"), (6, "35–54"), (7, "55+")],
    "gender": [(3, "Men"), (4, "Women")],
    "location": [(14, "Metro"), (15, "Regional")],
    "disability": [
        (23, "Personal connection to disability"),
        (25, "Living with a disability"),
        (26, "Caring for someone with a disability"),
        (28, "No connection to disability"),
    ],
}

QUESTIONS = ["SHWA23", "SHWA24", "SHWA25", "SHWA26", "SHWA_D1"]


def extract_sheet(ws):
    rows = list(ws.iter_rows(values_only=True))
    question_text = (rows[3][0] or "").strip()
    sample_row = rows[3]
    # Response rows: label in col 1, values onward; skip significance rows
    responses = []
    for row in rows[4:]:
        label = row[1]
        if not label:
            continue
        responses.append((label.strip(), row))
    out = {"question": question_text, "segments": {}}
    for seg_name, cols in SEGMENTS.items():
        groups = []
        for col, group_label in cols:
            values = {}
            for label, row in responses:
                v = row[col]
                values[label] = round(float(v) * 100, 1) if v not in (None, "") else None
            groups.append({
                "label": group_label,
                "n": int(sample_row[col]),
                "values": values,
            })
        out["segments"][seg_name] = groups
    return out


def main(path):
    wb = openpyxl.load_workbook(path, read_only=True)
    data = {q: extract_sheet(wb[q]) for q in QUESTIONS}
    js = "window.POLL_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"
    with open("docs/data.js", "w") as f:
        f.write(js)
    print("Wrote docs/data.js")


if __name__ == "__main__":
    main(sys.argv[1])
