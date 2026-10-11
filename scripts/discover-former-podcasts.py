#!/usr/bin/env python3
"""Auditable podcast discovery across *all* historical members of US Congress.

This is a lead generator, NOT an automatic inclusion tool. Apple metadata
does not prove that the former member hosted an episode or an entire show.

Source roster: https://github.com/unitedstates/congress-legislators
Podcast index: Apple iTunes Search API (public, rate limited).
"""
from __future__ import annotations

import argparse
import csv
import json
import random
import re
import sys
import time
import unicodedata
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

import yaml

BASE = "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/"
APPLE = "https://itunes.apple.com/search"
HEADERS = {"User-Agent": "FiresideChat-FormerCongressDiscovery/1.0 (civic podcast index)", "Accept": "application/json"}
ALIAS = {
    "william": "Bill", "robert": "Bob", "james": "Jim", "michael": "Mike",
    "richard": "Dick", "joseph": "Joe", "charles": "Chuck", "edward": "Ted",
    "thomas": "Tom", "stephen": "Steve", "steven": "Steve", "daniel": "Dan",
    "donald": "Don", "patrick": "Pat", "timothy": "Tim", "ronald": "Ron",
    "elizabeth": "Liz", "margaret": "Maggie", "christopher": "Chris",
    "benjamin": "Ben", "francis": "Frank", "anthony": "Tony",
}


def http_text(url: str, retries: int = 3) -> str:
    last_error = None
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=30) as res:
                return res.read().decode("utf-8")
        except (HTTPError, URLError, TimeoutError, UnicodeError) as error:
            last_error = error
            if attempt + 1 < retries:
                time.sleep(min(25, 3 * (2 ** attempt)) + random.uniform(0, 1))
    raise RuntimeError(f"Fetch failed for {url}: {last_error}")


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value))
    value = "".join(c for c in value if not unicodedata.combining(c))
    return " ".join(re.findall(r"[a-z0-9]+", value.casefold()))


def year(value) -> int:
    if isinstance(value, (date, datetime)):
        return value.year
    text = str(value or "")
    return int(text[:4]) if re.match(r"^\d{4}", text) else 0


def name_parts(entry: dict) -> tuple[str, str, str]:
    n = entry.get("name") or {}
    first = str(n.get("first", "")).strip()
    last = str(n.get("last", "")).strip()
    display = str(n.get("official_full") or (first + " " + last)).strip()
    return first, last, display


def load_roster(args) -> list[dict]:
    def read_yaml(key):
        path = getattr(args, key + "_file")
        content = Path(path).read_text(encoding="utf-8") if path else http_text(BASE + "legislators-" + key + ".yaml")
        return yaml.safe_load(content)

    historical = read_yaml("historical")
    current = read_yaml("current")
    current_ids = {str((x.get("id") or {}).get("bioguide", "")) for x in current}
    seen = set()
    roster = []
    for entry in historical:
        uid = str((entry.get("id") or {}).get("bioguide", ""))
        if not uid or uid in seen:
            continue
        seen.add(uid)
        if uid in current_ids:
            # The same person may have historical terms, but they are currently
            # serving and already covered by the current-member census.
            continue
        first, last, display = name_parts(entry)
        if not first or not last:
            continue
        terms = entry.get("terms") or []
        last_end = max((year(term.get("end")) for term in terms), default=0)
        first_start = min((year(term.get("start")) for term in terms), default=0)
        birth = year((entry.get("bio") or {}).get("birthday"))
        parties = sorted({str(t.get("party")) for t in terms if t.get("party")})
        states = sorted({str(t.get("state")) for t in terms if t.get("state")})
        chamber = sorted({str(t.get("type")) for t in terms if t.get("type")})
        # This is a discovery prioritization, not an exclusion from FiresideChat.
        # The source dataset does not include confirmed death dates.
        modern_search = last_end >= 1990 or birth >= 1900
        roster.append({
            "bioguide": uid, "full_name": display, "first": first, "last": last,
            "service_start": first_start, "service_end": last_end,
            "birth_year": birth, "states": "|".join(states),
            "chambers": "|".join(chamber), "historical_parties": "|".join(parties),
            "auto_search": modern_search,
            "search_note": "PODCAST_ERA_SCREEN" if modern_search else "OLDER_HISTORICAL_RECORD_MANUAL_REVIEW",
        })
    return sorted(roster, key=lambda x: (x["service_end"], x["full_name"], x["bioguide"]))


def queries_for(person: dict) -> list[str]:
    first = person["first"]
    last = person["last"]
    queries = [f"{first} {last}"]
    alias = ALIAS.get(normalize(first))
    if alias and normalize(alias) != normalize(first):
        queries.append(f"{alias} {last}")
    # Display names may include different first names used professionally.
    display = person["full_name"]
    if normalize(display) not in {normalize(q) for q in queries} and len(normalize(display).split()) <= 4:
        queries.append(display)
    return list(dict.fromkeys(queries))


def matches(name: dict, hit: dict) -> tuple[bool, str]:
    title = normalize(hit.get("collectionName", ""))
    creator = normalize(hit.get("artistName", ""))
    given = normalize(name["first"])
    family = normalize(name["last"])
    names = [normalize(q) for q in queries_for(name)]
    # Publishers often own the Apple listing and omit the host from its
    # title/artist fields. Apple may instead identify that person in its
    # narrative descriptions (e.g. Zeteo or Treefort shows).
    # Keep such hits for *manual* review, never automatic registration.
    fields = {
        "show-title": title,
        "creator": creator,
        "show-description": normalize(hit.get("collectionDescription", "")),
        "description": normalize(hit.get("description", "")),
        "summary": normalize(hit.get("summary", "")),
    }
    for field, haystack in fields.items():
        for candidate in names:
            if candidate and re.search(r"(?<!\w)" + re.escape(candidate) + r"(?!\w)", haystack):
                return True, field
    # Matching first and last as *independent* tokens creates false leads when
    # one presenter supplies the first name and another supplies the surname:
    # "Justin Williams and John Dyer" must never match John Williams.
    # Accept a narrowly defined middle initial within a single name span.
    if given and family:
        initials = r"(?<!\\w)" + re.escape(given) + r" [a-z] " + re.escape(family) + r"(?!\\w)"
        for field, haystack in fields.items():
            if re.search(initials, haystack):
                return True, field + "-middle-initial"
    return False, ""


def search_apple(person: dict) -> tuple[list[dict], list[str]]:
    found: dict[str, dict] = {}
    failures: list[str] = []
    for q in queries_for(person):
        params = urlencode({"term": q, "media": "podcast", "entity": "podcast", "country": "US", "limit": 100})
        try:
            payload = json.loads(http_text(APPLE + "?" + params))
            for h in payload.get("results", []):
                ok, evidence = matches(person, h)
                if not ok:
                    continue
                feed = h.get("feedUrl", "")
                url = h.get("trackViewUrl", "")
                key = str(h.get("trackId") or url or feed)
                if not key:
                    continue
                found[key] = {
                    "bioguide": person["bioguide"],
                    "member": person["full_name"],
                    "query": q,
                    "show": h.get("collectionName", ""),
                    "publisher": h.get("artistName", ""),
                    "match_evidence": evidence,
                    "feed_url": feed,
                    "directory_url": url,
                    "apple_track_id": h.get("trackId", ""),
                    "candidate_status": "HOST_RELATIONSHIP_UNVERIFIED",
                    "review_note": "Verify recurring host/producer role, member identity, feed reachability, and mixed-feed scope before registry inclusion.",
                }
        except Exception as error:
            failures.append(f"{q}: {error}")
    return list(found.values()), failures


def write_csv(path: Path, rows: list[dict], fields: list[str]):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--historical-file", help="Optional local historical YAML for reproducible/offline use")
    ap.add_argument("--current-file", help="Optional local current YAML for reproducible/offline use")
    ap.add_argument("--out-dir", default="census-results")
    ap.add_argument("--shard", type=int, default=0)
    ap.add_argument("--shards", type=int, default=1)
    ap.add_argument("--limit", type=int, default=0, help="Limit queried people per shard for smoke tests")
    ap.add_argument("--sleep", type=float, default=2.25, help="Pause between API requests to respect rate limits")
    ap.add_argument("--roster-only", action="store_true", help="Write the full historical roster, skip Apple searches")
    args = ap.parse_args()
    if args.shards < 1 or args.shard < 0 or args.shard >= args.shards or args.sleep < 0:
        ap.error("Invalid shard/shards/sleep values")
    target = Path(args.out_dir)
    target.mkdir(parents=True, exist_ok=True)
    roster = load_roster(args)
    roster_columns = ["bioguide", "full_name", "first", "last", "service_start", "service_end",
                      "birth_year", "states", "chambers", "historical_parties", "auto_search", "search_note"]
    if args.shard == 0:
        write_csv(target / "all-former-members.csv", roster, roster_columns)
    all_modern = [p for p in roster if p["auto_search"]]
    chunk = [p for idx, p in enumerate(all_modern) if idx % args.shards == args.shard]
    if args.limit:
        chunk = chunk[:args.limit]
    results: list[dict] = []
    progress: list[dict] = []
    for i, person in enumerate(chunk):
        if args.roster_only:
            status = "ROSTER_ONLY"
            candidates, errors = [], []
        else:
            candidates, errors = search_apple(person)
            status = "API_ERROR" if errors else "SEARCHED_POSSIBLE_MATCH" if candidates else "SEARCHED_NO_DIRECT_NAME_MATCH"
        results.extend(candidates)
        progress.append({
            **person, "search_status": status,
            "potential_show_count": len(candidates),
            "error": " | ".join(errors)[:800],
            "searched_at": datetime.now(timezone.utc).isoformat() if not args.roster_only else "",
        })
        if not args.roster_only and i + 1 < len(chunk):
            time.sleep(args.sleep)
        if (i + 1) % 100 == 0:
            print(f"Shard {args.shard}: {i+1}/{len(chunk)} searched; {len(results)} candidate links",flush=True)
    candidate_cols = ["bioguide", "member", "show", "publisher", "match_evidence",
                      "feed_url", "directory_url", "apple_track_id", "query",
                      "candidate_status", "review_note"]
    write_csv(target / f"potential-shows-shard-{args.shard}.csv", results, candidate_cols)
    write_csv(target / f"search-audit-shard-{args.shard}.csv", progress,
              roster_columns + ["search_status", "potential_show_count", "error", "searched_at"])
    stats = {
        "source": BASE, "apple_search": APPLE,
        "total_former_member_records": len(roster),
        "podcast_era_search_population": len(all_modern),
        "older_records_queued_for_historical_review": len(roster) - len(all_modern),
        "shard": args.shard, "shards": args.shards, "shard_count": len(chunk),
        "apple_search_errors": sum(bool(p["error"]) for p in progress),
        "candidate_hits": len(results),
        "status_counts": {status: sum(p["search_status"] == status for p in progress)
                          for status in sorted({p["search_status"] for p in progress})},
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "caveat": "Direct-name matches are discovery leads, NOT verified host relationships; no-match does NOT establish that no show exists.",
    }
    (target / f"summary-shard-{args.shard}.json").write_text(
        json.dumps(stats, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(stats, indent=2), flush=True)
    return 0 if stats["apple_search_errors"] == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
