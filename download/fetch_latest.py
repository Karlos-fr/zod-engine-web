#!/usr/bin/env python3
"""Download the newest Zod Engine artifact from each upstream category."""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen


PROJECT = "zod"
CATEGORIES = ("Windows", "Other", "Zod_engine", "Assets")
DESTINATION = Path(__file__).resolve().parent
USER_AGENT = "zod-engine-web source importer"


def get_json(url: str) -> object:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=60) as response:
        return json.load(response)


def category_files(category: str) -> list[dict[str, object]]:
    encoded_category = quote(category, safe="")
    url = f"https://sourceforge.net/rest/p/{PROJECT}/files/{encoded_category}"
    listing = get_json(url)
    if not isinstance(listing, list):
        raise RuntimeError(f"Unexpected SourceForge response for {category!r}")
    return [item for item in listing if item.get("type") == "f"]


def newest_file(category: str) -> dict[str, object]:
    files = category_files(category)
    if not files:
        raise RuntimeError(f"No files found in SourceForge category {category!r}")
    return max(files, key=lambda item: str(item.get("date", "")))


def download(category: str) -> dict[str, object]:
    artifact = newest_file(category)
    name = str(artifact["name"])
    url = str(artifact.get("download_url") or artifact["url"])
    target = DESTINATION / name
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=300) as response, target.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    return {"category": category, "file": name, "source": url}


def main() -> None:
    manifest = [download(category) for category in CATEGORIES]
    (DESTINATION / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
