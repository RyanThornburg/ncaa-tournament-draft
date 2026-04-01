"""
Script to convert team seedings from a CSV file into SQL statements for database insertion.
# Write to a .sql file (then run separately):
  python3 team_data/seed_teams.py team_data/teams_2025.csv
  wrangler d1 execute march-madness-db --file=./teams_2025.sql
"""

import argparse
import csv
import re
from pathlib import Path
from typing import Any
from collections import Counter

REQUIRED_FIELDS: set[str] = {"name", "seed", "region", "overall_rank"}
VALIDATE_INT_FIELDS: set[str] = {"seed", "overall_rank"}
MAX_TEAMS: int = 68
PLAY_IN_COUNT: int = 4
MAX_REGION_TEAMS: int = 16
MIN_RANK: int = 1
Row = dict[str, Any]


def parse_year_from_filename(filename: str) -> int | None:
    """Extracts the year from the filename using a regular expression."""
    match_year = re.search(r"(20\d{2})", filename)
    return int(match_year.group(1)) if match_year else None


def escape_sql_string(value: str) -> str:
    """Escape single quotes for SQLite string literals."""
    return value.replace("'", "''")


def validate_seed_and_rank(row: Row, field: str, row_num: int) -> str | None:
    """Validate seed and rank"""
    max_val: int = MAX_REGION_TEAMS if field.lower() == "seed" else MAX_TEAMS

    try:
        value = int(row.get(field, ""))
        if not MIN_RANK <= value <= max_val:
            return f"Row {row_num}: {field} must be {MIN_RANK}-{max_val}, got: {value}"
    except ValueError:
        return f"Row {row_num}: {field} must be an integer"

    return None


def validate_row(row: Row, row_num: int) -> list[str]:
    """Validate row for errors"""
    errors: list[str] = []
    missing_errors = [
        f"Row {row_num}: missing {s}" for s in REQUIRED_FIELDS if not row.get(s)
    ]
    errors.extend(missing_errors)

    # data validation
    for f in VALIDATE_INT_FIELDS:
        if row.get(f):
            validate_error: str | None = validate_seed_and_rank(row, f, row_num)
            if validate_error:
                errors.append(validate_error)

    return errors


def check_results(row_count: int, ranks: list[int], all_errors: list[str]) -> None:
    """
    Check raise error if
        - errors found validating data
        - incorrect number of records found
        - duplicate rankings found
    """
    # data errors
    if all_errors:
        print("Validation errors found:")
        for e in all_errors:
            print(f"\t{e}")
        raise ValueError("Invalid csv data")

    # missing or too many
    if row_count != MAX_TEAMS and row_count != MAX_TEAMS-PLAY_IN_COUNT:
        raise ValueError(f"Error! Expecting {MAX_TEAMS} teams, found {row_count}")

    # duplicates?
    if len(ranks) != len(set(ranks)):
        dupes = [rank for rank, count in Counter(ranks).items() if count > 1]
        raise ValueError(f"Error! Duplicate overall_rank values: {sorted(dupes)}")


def build_sql_statement(rows: list[Row], filename: str, tournament_year: int) -> str:
    """create sql statement for teams table insertion"""

    sql_lines: list[str] = []
    sql_lines.append(
        f"-- SQL created from {filename} for the {tournament_year} tournament"
    )
    sql_lines.append("")
    sql_lines.append(
        "-- Delete existing teams before inserting new ones"
    )
    sql_lines.append(f"DELETE FROM teams WHERE season_year = {tournament_year};")
    sql_lines.append("")
    sql_lines.append(
        "INSERT OR REPLACE INTO teams (id, name, seed, region, overall_rank, season_year) VALUES"
    )

    lines: list[str] = []
    for row in rows:
        name: str = escape_sql_string(row["name"])
        clean_name = re.sub(r'[^a-zA-Z0-9]', '', row["name"]).upper()
        seed = int(row["seed"])
        region: str = escape_sql_string(row["region"])
        rank = int(row["overall_rank"])
        record_id: str = f"{tournament_year}-{rank}-{clean_name}"
        lines.append(
            f" ('{record_id}', '{name}', {seed}, '{region}', {rank}, {tournament_year})"
        )
    sql_lines.append(",\n".join(lines) + ";")
    sql_lines.append("")
    return "\n".join(sql_lines)


def convert_csv_to_sql(csv_path: Path, tournament_year: int) -> str:
    """Converts the CSV data into SQL"""

    rows: list[Row] = []
    all_errors: list[str] = []  # catch all errors and display at end vs one row
    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        # validate column headers
        if reader.fieldnames is None:
            raise ValueError("CSV file is empty or has no header row.")

        missing_cols: set[str] = REQUIRED_FIELDS - {
            c.strip() for c in reader.fieldnames
        }
        if missing_cols:
            raise ValueError(f"CSV missing columns: {', '.join(sorted(missing_cols))}")

        # loop csv file
        for i, row in enumerate(reader, start=2):
            row: Row = {k.strip(): v.strip() for k, v in row.items()}
            errors: list[str] = validate_row(row, i)
            if errors:
                all_errors.extend(errors)

            rows.append(row)

        ranks: list[int] = [int(row["overall_rank"]) for row in rows] if not all_errors else []
        check_results(len(rows), ranks, all_errors)

    return build_sql_statement(rows, csv_path.name, tournament_year)


def main():
    """Prompt user for inputs and output sql file"""
    parser = argparse.ArgumentParser(description="Team CSV listing to SQL")
    parser.add_argument(
        "csv_file",
        help="Path to the CSV file containing team data (ex: teams_2025.csv)",
    )
    parser.add_argument(
        "--year", type=int, help="Tournament year (default: parsed from filename)"
    )
    parser.add_argument(
        "--output", help="Output SQL file (default: teams_{year}.sql)"
    )
    args = parser.parse_args()

    csv_path = Path(args.csv_file)
    if not csv_path.exists():
        print(f"Error! File not found: {csv_path}")
        return

    tournament_year = (
        args.year if args.year is not None else parse_year_from_filename(csv_path.stem)
    )
    if not tournament_year:
        print("""Error! Could not determine year from filename.
            Please provide the year using the --year argument or
            ensure the filename contains a year (e.g., teams_2025.csv).""")
        return

    sql: str = convert_csv_to_sql(csv_path, tournament_year)
    output_path = Path(args.output) if args.output else Path(f"team_data/teams_{tournament_year}.sql")
    output_path.write_text(sql, encoding="utf-8")
    print(f"Successfully generated SQL file: {output_path}")


if __name__ == "__main__":
    main()
