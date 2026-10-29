"""Restore large bundled teaching assets from verified source chunks."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "asset_parts" / "manifest.json"


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for item in manifest["assets"]:
        payload = b"".join((ROOT / part).read_bytes() for part in item["parts"])
        digest = hashlib.sha256(payload).hexdigest()
        if digest != item["sha256"] or len(payload) != item["size"]:
            raise RuntimeError(f"Asset verification failed: {item['path']}")
        target = ROOT / item["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(payload)
        print(f"restored {item['path']}")


if __name__ == "__main__":
    main()
