#!/usr/bin/env python3
"""Project Africa_Countries.geojson into compact SVG paths for the loader and admin map."""

from __future__ import annotations

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "geo" / "africa-countries.geojson"
OUT = ROOT / "src" / "data" / "africa-countries.json"

MIN_LON, MAX_LON = -25.3605549583648, 63.4957540896971
MIN_LAT, MAX_LAT = -46.9697260962375, 37.3404090904013
PAD = 10
W, H = 400, 430

PILOT = {"GH"}
OWN_EXCHANGE = {"NG", "KE", "ZA"}
BRVM = {"CI", "SN", "BJ", "BF", "ML", "NE", "TG", "GW"}
PLANNED_EXCHANGE = {"EG", "MA", "TN", "MU", "RW", "UG", "TZ", "NA", "BW", "ZW"}


def status_for(iso2: str) -> str:
    if iso2 in PILOT:
        return "pilot"
    if iso2 in OWN_EXCHANGE or iso2 in BRVM:
        return "coming_soon"
    if iso2 in PLANNED_EXCHANGE:
        return "planned"
    return "watch"


def perp_dist(p, a, b) -> float:
    (x, y), (x1, y1), (x2, y2) = p, a, b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))


def douglas(points, tol):
    if len(points) < 3:
        return points
    max_d, idx = -1.0, 0
    a, b = points[0], points[-1]
    for i in range(1, len(points) - 1):
        d = perp_dist(points[i], a, b)
        if d > max_d:
            max_d, idx = d, i
    if max_d > tol:
        left = douglas(points[: idx + 1], tol)
        right = douglas(points[idx:], tol)
        return left[:-1] + right
    return [points[0], points[-1]]


def project(lon: float, lat: float):
    x = PAD + (lon - MIN_LON) / (MAX_LON - MIN_LON) * (W - 2 * PAD)
    y = PAD + (MAX_LAT - lat) / (MAX_LAT - MIN_LAT) * (H - 2 * PAD)
    return (round(x, 2), round(y, 2))


def count_points(coords) -> int:
    if isinstance(coords[0], (int, float)):
        return 1
    return sum(count_points(item) for item in coords)


def ring_to_path(ring, tol):
    simplified = douglas(ring, tol)
    if len(simplified) < 4:
        step = max(1, len(ring) // 16)
        simplified = ring[::step]
        if ring[-1] != simplified[-1]:
            simplified.append(ring[-1])
    pts = [project(lon, lat) for lon, lat in simplified]
    out = []
    for p in pts:
        if not out or out[-1] != p:
            out.append(p)
    if len(out) < 3:
        return "", out
    d = f"M{out[0][0]} {out[0][1]}" + "".join(f"L{x} {y}" for x, y in out[1:]) + "Z"
    return d, out


def geom_paths(geom, tol):
    paths = []
    pts = []
    if geom["type"] == "Polygon":
        rings = [geom["coordinates"][0]]
    else:
        rings = [poly[0] for poly in geom["coordinates"]]
    for ring in rings:
        if len(ring) < 4:
            continue
        d, projected = ring_to_path(ring, tol)
        if d:
            paths.append(d)
            pts.extend(projected)
    return paths, pts


def tol_for(iso2: str, npts: int) -> float:
    if iso2 == "GH":
        return 0.05
    if iso2 in {"CV", "ST", "SC", "MU", "KM", "GQ", "GM", "LS", "SZ", "DJ", "BI", "RW"}:
        return 0.03
    if npts > 800:
        return 0.16
    if npts > 300:
        return 0.12
    return 0.08


def main() -> None:
    geo = json.loads(SRC.read_text())
    countries = []
    for feat in geo["features"]:
        props = feat["properties"]
        iso2 = props["ISO_2DIGIT"]
        geom = feat["geometry"]
        npts = count_points(geom["coordinates"])
        paths, pts = geom_paths(geom, tol_for(iso2, npts))
        if not paths or not pts:
            continue
        xs = [pt[0] for pt in pts]
        ys = [pt[1] for pt in pts]
        countries.append(
            {
                "iso2": iso2,
                "iso3": props["ISO_3DIGIT"],
                "name": props["NAME"],
                "affiliation": props.get("COUNTRYAFF") or props["NAME"],
                "population": int(props.get("TOTPOP") or 0),
                "path": " ".join(paths),
                "cx": round(sum(xs) / len(xs), 2),
                "cy": round(sum(ys) / len(ys), 2),
                "status": status_for(iso2),
            }
        )
    countries.sort(key=lambda c: c["name"])
    payload = {
        "viewBox": f"0 0 {W} {H}",
        "width": W,
        "height": H,
        "source": "Africa_Countries.geojson (CRS84)",
        "countries": countries,
    }
    OUT.write_text(json.dumps(payload, separators=(",", ":")))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(countries)} countries)")


if __name__ == "__main__":
    main()
