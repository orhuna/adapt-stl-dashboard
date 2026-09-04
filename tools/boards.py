#!/usr/bin/env python3
"""
Rebuild ADAPT-STL board configurations from the Google Sheet.

Three input routes, all producing the same objects:

  # 1. Straight from the deployed Apps Script (needs the view key)
  python tools/boards.py --url "https://script.google.com/macros/s/AKfy.../exec" --key stl-forum-2026

  # 2. From the raw_json tab, downloaded as CSV (File > Download > CSV)
  python tools/boards.py --raw-csv raw_json.csv

  # 3. From the panels tab, downloaded as CSV — no JSON needed
  python tools/boards.py --panels-csv panels.csv

Output:

  --layout   print each board as a text diagram of its rows and columns
  --tidy     write a tidy one-row-per-panel CSV
  --wide     write a one-row-per-board CSV with the layout as a single string
  --json-dir dump one .json per board (only with --url or --raw-csv)

With no output flag it prints a summary of every board.
"""

import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from urllib.request import urlopen

COLS = 6  # the canvas is six columns wide in rows-and-columns mode


# ---------------------------------------------------------------- loading

def from_url(url, key):
    sep = "&" if "?" in url else "?"
    with urlopen(f"{url}{sep}boards=1&key={key}") as r:
        data = json.load(r)
    if not data.get("ok"):
        sys.exit(f"Server said no: {data.get('error')}")
    return data["boards"]


def from_raw_csv(path):
    boards = []
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            blob = row.get("json") or row.get("raw_json") or ""
            if not blob.strip():
                continue
            try:
                boards.append(json.loads(blob))
            except json.JSONDecodeError:
                print(f"  ! skipped an unparseable row ({row.get('board_code')})", file=sys.stderr)
    return boards


def from_panels_csv(path):
    """Reassemble board objects from the flat panels tab."""
    grouped = defaultdict(list)
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            grouped[row["board_code"]].append(row)

    def num(v):
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None

    boards = []
    for code, rows in grouped.items():
        rows.sort(key=lambda r: num(r.get("panel_order")) or 0)
        h = rows[0]
        boards.append({
            "boardCode": code,
            "event": h.get("event", ""),
            "submittedAt": h.get("submitted_at", ""),
            "appTitle": h.get("app_title", ""),
            "purposeLabel": h.get("purpose", ""),
            "hazardLabel": h.get("hazard", ""),
            "templateLabel": h.get("template", ""),
            "layoutMode": h.get("layout_mode", "grid"),
            "role": h.get("role", ""),
            "organization": h.get("organization", ""),
            "brief": {
                "decision": h.get("decision", ""), "action": h.get("action", ""),
                "who": h.get("audience", ""), "frequency": h.get("open_frequency", ""),
                "missing": h.get("missing_data", ""), "barrier": h.get("barrier", ""),
                "contact": h.get("contact", ""),
            },
            "report": {
                "wanted": h.get("report_wanted") == "yes",
                "name": h.get("report_name", ""),
            },
            "surfaceWidthPx": num(h.get("surface_width_px")),
            "panels": [{
                "order": num(r.get("panel_order")),
                "type": r.get("panel_type", ""),
                "typeName": r.get("panel_type_name", ""),
                "category": r.get("panel_category", ""),
                "hazardTag": r.get("panel_hazard_tag", ""),
                "title": r.get("panel_title", ""),
                "need": r.get("need_text", ""),
                "dataNeeded": r.get("data_needed", ""),
                "geography": r.get("geography", ""),
                "freshness": r.get("freshness", ""),
                "dataAvailability": r.get("data_availability", ""),
                "priority": r.get("priority", ""),
                "rowIndex": num(r.get("row_index")),
                "colIndex": num(r.get("col_index")),
                "widthCols": num(r.get("width_cols")),
                "heightRows": num(r.get("height_rows")),
                "x": num(r.get("pos_x")), "y": num(r.get("pos_y")),
                "widthPx": num(r.get("width_px")), "heightPx": num(r.get("height_px")),
            } for r in rows],
        })
    return boards


# ---------------------------------------------------------------- layout

def rows_of(board):
    """Group panels into visual rows. Works for both layout modes.

    Rows mode  -> group on row_index, order within the row by col_index.
    Free mode  -> band panels whose vertical centres are within 60 px of each
                  other, which is how the eye reads a free-form canvas.
    """
    panels = [p for p in board.get("panels", []) if p]
    if board.get("layoutMode") == "free":
        bands = []
        for p in sorted(panels, key=lambda p: ((p.get("y") or 0), (p.get("x") or 0))):
            centre = (p.get("y") or 0) + (p.get("heightPx") or 0) / 2
            for band in bands:
                if abs(band["centre"] - centre) <= 60:
                    band["panels"].append(p)
                    break
            else:
                bands.append({"centre": centre, "panels": [p]})
        for band in bands:
            band["panels"].sort(key=lambda p: p.get("x") or 0)
        return [b["panels"] for b in bands]

    by_row = defaultdict(list)
    for p in panels:
        by_row[p.get("rowIndex") or 0].append(p)
    return [sorted(by_row[k], key=lambda p: p.get("colIndex") or 0)
            for k in sorted(by_row)]


def layout_string(board, sep=" | "):
    """One-line summary of the arrangement, e.g. 'map + kpi / chart / table'."""
    return " / ".join(sep.join(p.get("type") or "?" for p in row)
                      for row in rows_of(board))


def diagram(board, width=74):
    """A text picture of the board, proportional to the real column widths."""
    out = []
    title = board.get("appTitle") or "(untitled)"
    out.append("+" + "-" * (width - 2) + "+")
    out.append("|" + f" {title} "[:width - 2].ljust(width - 2) + "|")
    out.append("+" + "-" * (width - 2) + "+")

    free = board.get("layoutMode") == "free"
    surface = board.get("surfaceWidthPx") or 1180

    for row in rows_of(board):
        if free:
            shares = [max(1, round((p.get("widthPx") or 0) / surface * COLS)) for p in row]
        else:
            shares = [max(1, p.get("widthCols") or 1) for p in row]
        total = sum(shares) or 1
        inner = width - 2 - (len(row) - 1)
        widths = [max(6, int(inner * s / total)) for s in shares]
        widths[-1] += inner - sum(widths)

        cells, labels, notes = [], [], []
        for p, w in zip(row, widths):
            cells.append("-" * w)
            labels.append((" " + (p.get("title") or p.get("typeName") or ""))[:w].ljust(w))
            need = (p.get("need") or "").replace("\n", " ")
            notes.append((" " + (need or "(no note)"))[:w].ljust(w))
        out.append("|" + "+".join(cells) + "|")
        out.append("|" + "|".join(labels) + "|")
        out.append("|" + "|".join(notes) + "|")
    out.append("+" + "-" * (width - 2) + "+")
    return "\n".join(out)


# ---------------------------------------------------------------- output

TIDY = ["board_code", "app_title", "purpose", "hazard", "template", "layout_mode",
        "role", "organization", "report_wanted", "visual_row", "visual_col",
        "panel_order", "panel_type", "panel_type_name", "panel_category",
        "panel_title", "need_text", "data_needed", "geography", "freshness",
        "data_availability", "priority", "width_cols", "height_rows",
        "pos_x", "pos_y", "width_px", "height_px"]


def write_tidy(boards, path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(TIDY)
        for b in boards:
            for ri, row in enumerate(rows_of(b), 1):
                for ci, p in enumerate(row, 1):
                    w.writerow([
                        b.get("boardCode"), b.get("appTitle"), b.get("purposeLabel"),
                        b.get("hazardLabel"), b.get("templateLabel"), b.get("layoutMode"),
                        b.get("role"), b.get("organization"),
                        "yes" if (b.get("report") or {}).get("wanted") else "no",
                        ri, ci,
                        p.get("order"), p.get("type"), p.get("typeName"), p.get("category"),
                        p.get("title"), p.get("need"), p.get("dataNeeded"), p.get("geography"),
                        p.get("freshness"), p.get("dataAvailability"), p.get("priority"),
                        p.get("widthCols"), p.get("heightRows"),
                        p.get("x"), p.get("y"), p.get("widthPx"), p.get("heightPx"),
                    ])


def write_wide(boards, path):
    head = ["board_code", "app_title", "purpose", "hazard", "template", "layout_mode",
            "role", "organization", "n_panels", "n_rows", "max_panels_in_a_row",
            "layout", "panel_types", "report_wanted", "report_name", "decision", "action"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(head)
        for b in boards:
            rows = rows_of(b)
            br, rp = b.get("brief") or {}, b.get("report") or {}
            w.writerow([
                b.get("boardCode"), b.get("appTitle"), b.get("purposeLabel"),
                b.get("hazardLabel"), b.get("templateLabel"), b.get("layoutMode"),
                b.get("role"), b.get("organization"),
                len(b.get("panels") or []), len(rows),
                max((len(r) for r in rows), default=0),
                layout_string(b),
                "; ".join(p.get("type") or "" for p in (b.get("panels") or [])),
                "yes" if rp.get("wanted") else "no", rp.get("name", ""),
                br.get("decision", ""), br.get("action", ""),
            ])


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--url", help="the Apps Script /exec URL")
    src.add_argument("--raw-csv", help="the raw_json tab exported as CSV")
    src.add_argument("--panels-csv", help="the panels tab exported as CSV")
    ap.add_argument("--key", default="stl-forum-2026", help="VIEW_KEY (with --url)")
    ap.add_argument("--layout", action="store_true", help="print a diagram of every board")
    ap.add_argument("--tidy", help="write a tidy panel-level CSV here")
    ap.add_argument("--wide", help="write a board-level CSV here")
    ap.add_argument("--json-dir", help="dump one .json per board into this folder")
    a = ap.parse_args()

    if a.url:
        boards = from_url(a.url, a.key)
    elif a.raw_csv:
        boards = from_raw_csv(a.raw_csv)
    else:
        boards = from_panels_csv(a.panels_csv)

    print(f"{len(boards)} board(s) loaded.\n")

    for b in boards:
        rows = rows_of(b)
        print(f"{b.get('boardCode')}  {b.get('appTitle')}")
        print(f"  {b.get('purposeLabel')} · {b.get('hazardLabel')} · "
              f"{b.get('templateLabel')} · {b.get('layoutMode')} · "
              f"{len(b.get('panels') or [])} panels in {len(rows)} row(s)")
        print(f"  layout: {layout_string(b)}")
        if (b.get("report") or {}).get("wanted"):
            print(f"  report: {(b['report'].get('name') or '(unnamed)')}")
        if a.layout:
            print()
            print(diagram(b))
        print()

    if a.tidy:
        write_tidy(boards, a.tidy)
        print(f"wrote {a.tidy}")
    if a.wide:
        write_wide(boards, a.wide)
        print(f"wrote {a.wide}")
    if a.json_dir:
        os.makedirs(a.json_dir, exist_ok=True)
        for b in boards:
            p = os.path.join(a.json_dir, f"{b.get('boardCode') or 'board'}.json")
            with open(p, "w", encoding="utf-8") as f:
                json.dump(b, f, indent=2)
        print(f"wrote {len(boards)} file(s) to {a.json_dir}/")


if __name__ == "__main__":
    main()
