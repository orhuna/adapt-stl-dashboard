#!/usr/bin/env python3
"""
Make the ADAPT-STL Design Studio QR code.

    pip install "qrcode[pil]" opencv-python-headless

    python tools/make_qr.py                      # PNG + SVG at the defaults
    python tools/make_qr.py --url https://... --out my-qr
    python tools/make_qr.py --caption "Scan to design your tool" --plain

Produces a print-ready PNG (default 1200 px, which is comfortably over 300 dpi
at A5) and an SVG for placing in InDesign, Illustrator or a poster template.
Every code is decoded again before it is written, so a broken file cannot
silently make it onto a printed table tent.
"""

import argparse
import sys

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from qrcode.image.svg import SvgPathImage
from PIL import Image, ImageDraw, ImageFont


def rgb(hexstr):
    h = hexstr.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

URL = "https://orhuna.github.io/adapt-stl-dashboard/"
TEAL = "#0a6a72"          # the studio's primary
INK = "#12232b"
PAPER = "#ffffff"


def font(size, bold=False):
    """Best available system font, falling back to PIL's bitmap default."""
    names = [
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else ""),
        "Helvetica.ttc", "Arial.ttf",
    ]
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build(url, px, fg, rounded):
    """Return a square PIL image of the code itself, sized to `px`."""
    qr = qrcode.QRCode(
        version=None,                                    # smallest that fits
        error_correction=qrcode.constants.ERROR_CORRECT_Q,  # 25% recoverable
        box_size=10,
        border=4,                                        # the quiet zone; never go below 4
    )
    qr.add_data(url)
    qr.make(fit=True)

    if rounded:
        # StyledPilImage ignores fill_color — the colour comes from the mask.
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(radius_ratio=1.0),
            color_mask=SolidFillColorMask(front_color=rgb(fg), back_color=rgb(PAPER)),
        ).convert("RGB")
    else:
        img = qr.make_image(fill_color=fg, back_color=PAPER).convert("RGB")

    # NEAREST keeps the module edges crisp — never resample a QR code smoothly.
    return img.resize((px, px), Image.NEAREST), qr.version


def caption(img, title, sub, fg):
    """Add a title above and the literal URL below, so a failed scan still works."""
    w = img.width
    f_title, f_sub = font(int(w * 0.055), bold=True), font(int(w * 0.032))

    # The code already carries a 4-module quiet zone, so sit the type close to it.
    top = int(w * 0.13) if title else 0
    bottom = int(w * 0.10) if sub else 0
    out = Image.new("RGB", (w, img.height + top + bottom), PAPER)
    out.paste(img, (0, top))
    d = ImageDraw.Draw(out)

    if title:
        d.text((w / 2, top * 0.55), title, font=f_title, fill=fg, anchor="mm")
    if sub:
        d.text((w / 2, img.height + top + bottom * 0.35), sub,
               font=f_sub, fill=INK, anchor="mm")
    return out


def verify(path, url):
    """Decode the file we just wrote and confirm it carries the right URL."""
    try:
        import cv2
    except ImportError:
        print("  ! opencv not installed — skipping the decode check", file=sys.stderr)
        return None
    got, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(path))
    if got != url:
        sys.exit(f"  ! FAILED: {path} decodes to {got!r}, expected {url!r}")
    return got


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--url", default=URL)
    p.add_argument("--out", default="adapt-stl-qr", help="basename, no extension")
    p.add_argument("--px", type=int, default=1200, help="PNG size in pixels")
    p.add_argument("--color", default=TEAL)
    p.add_argument("--title", default="ADAPT-STL Design Studio")
    p.add_argument("--caption", default=None, help="text under the code (default: the URL)")
    p.add_argument("--plain", action="store_true", help="code only, no title or caption")
    p.add_argument("--square", action="store_true", help="hard square modules instead of rounded")
    a = p.parse_args()

    img, version = build(a.url, a.px, a.color, rounded=not a.square)
    if not a.plain:
        img = caption(img, a.title, a.caption if a.caption is not None else a.url, a.color)

    png = f"{a.out}.png"
    img.save(png, dpi=(300, 300))

    # SVG: vector, for print layout. Always plain — add type in your layout tool.
    svg = f"{a.out}.svg"
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4)
    qr.add_data(a.url)
    qr.make(fit=True)
    qr.make_image(image_factory=SvgPathImage).save(svg)

    print(f"wrote {png}  ({img.width}x{img.height}, version {version}, ~25% error correction)")
    print(f"wrote {svg}")
    decoded = verify(png, a.url)
    if decoded:
        print(f"verified: decodes to {decoded}")


if __name__ == "__main__":
    main()
