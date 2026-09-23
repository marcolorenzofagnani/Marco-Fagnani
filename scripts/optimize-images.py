#!/usr/bin/env python3
"""Regenerate WebP/responsive derivatives from source-assets originals."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "images"
SRC = ROOT / "source-assets"

PHOTOS = [
    "osteo-hero.jpg",
    "osteo-cervicale.jpg",
    "osteo-schiena.jpg",
    "osteo-craniale.jpg",
    "osteo-mobilita.jpg",
    "assess-core.jpg",
    "assess-device.jpg",
    "train-squat.jpg",
    "train-band.jpg",
    "train-treadmill.jpg",
]


def main() -> None:
    logo_src = SRC / "logo-original-3023.png"
    if logo_src.exists():
        im = Image.open(logo_src).convert("RGBA")
        h = 104
        w = int(round(im.width * (h / im.height)))
        s = im.resize((w, h), Image.Resampling.LANCZOS)
        s.save(IMG / "logo-header.png", optimize=True)
        s.save(IMG / "logo-header.webp", "WEBP", quality=88, method=6)
        print("logo-header", w, h)

    for name in PHOTOS:
        path = IMG / name
        if not path.exists():
            bak = SRC / f"orig-{name}"
            if bak.exists():
                path.write_bytes(bak.read_bytes())
            else:
                print("skip", name)
                continue
        img = Image.open(path).convert("RGB")
        stem = path.stem
        for tw in (480, 800, 1200):
            if img.width < tw * 0.85 and tw > 480 and max(img.size) < tw:
                continue
            scale = min(1.0, tw / max(img.size))
            if scale < 1:
                resized = img.resize(
                    (int(img.width * scale), int(img.height * scale)),
                    Image.Resampling.LANCZOS,
                )
            else:
                resized = img
            out = IMG / f"{stem}-w{tw}.webp"
            resized.save(out, "WEBP", quality=78, method=6)
            print(out.name, out.stat().st_size)
        img.save(IMG / f"{stem}.webp", "WEBP", quality=78, method=6)
        max_w = 1200
        out_jpg = img
        if img.width > max_w:
            nh = int(round(img.height * (max_w / img.width)))
            out_jpg = img.resize((max_w, nh), Image.Resampling.LANCZOS)
        out_jpg.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        print(name, path.stat().st_size)


if __name__ == "__main__":
    main()
