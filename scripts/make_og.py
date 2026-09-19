"""
Renders the Open Graph / social preview card at public/og.png.

Run it again after changing your name, role or headline stats:
    python3 scripts/make_og.py

It only needs Pillow (`pip install Pillow`). Nothing in the site build
depends on this script — it just writes a PNG.
"""

import math
import random
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
VOID = (1, 1, 16)
ICE = (232, 246, 255)
CYAN = (34, 211, 238)
MUTED = (132, 147, 184)
DIM = (91, 104, 140)

MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_B = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


img = Image.new("RGB", (W, H), VOID)
d = ImageDraw.Draw(img, "RGBA")

# ---- engineering grid --------------------------------------------------
for x in range(0, W, 68):
    d.line([(x, 0), (x, H)], fill=(255, 255, 255, 8))
for y in range(0, H, 68):
    d.line([(0, y), (W, y)], fill=(255, 255, 255, 8))

# ---- constellation on the right ---------------------------------------
random.seed(7)
pts = []
for _ in range(58):
    a = random.uniform(0, math.tau)
    r = random.uniform(0, 1) ** 0.6 * 230
    pts.append((880 + math.cos(a) * r, 315 + math.sin(a) * r * 0.95))

for i, p in enumerate(pts):
    for q in pts[i + 1 :]:
        dist = math.hypot(p[0] - q[0], p[1] - q[1])
        if dist < 105:
            alpha = int(52 * (1 - dist / 105))
            d.line([p, q], fill=(120, 190, 255, alpha), width=1)

for p in pts:
    r = random.uniform(1.4, 3.0)
    d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=(180, 235, 255, 190))

# soften the mesh so the type stays dominant
veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(veil).rectangle([0, 0, 640, H], fill=(1, 1, 16, 235))
img = Image.alpha_composite(img.convert("RGBA"), veil).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

# ---- bright boundary + corner ticks -----------------------------------
M = 40
d.rectangle([M, M, W - M, H - M], outline=(255, 255, 255, 56), width=1)
T = 22
for cx, cy, dx, dy in ((M, M, 1, 1), (W - M, M, -1, 1), (M, H - M, 1, -1), (W - M, H - M, -1, -1)):
    d.line([(cx, cy), (cx + T * dx, cy)], fill=CYAN, width=2)
    d.line([(cx, cy), (cx, cy + T * dy)], fill=CYAN, width=2)

# ---- type --------------------------------------------------------------
x = 88

d.text((x, 132), "// AI/ML ENGINEER  ·  CS STUDENT", font=font(MONO, 21), fill=(125, 211, 252))

name_font = font(MONO_B, 88)
d.text((x, 186), "Arjun", font=name_font, fill=ICE)
# measure rather than guess, so a different name still lays out correctly
gap = d.textlength("Arjun ", font=name_font)
# faint bloom behind the surname
d.text((x + gap + 3, 186), "Gupta", font=name_font, fill=(34, 211, 238, 70))
d.text((x + gap, 186), "Gupta", font=name_font, fill=CYAN)

d.text((x, 306), "Building intelligent systems for a better tomorrow.", font=font(MONO, 25), fill=(232, 246, 255, 230))

d.line([(x, 372), (x + 96, 372)], fill=CYAN, width=2)
d.line([(x + 96, 372), (x + 470, 372)], fill=(255, 255, 255, 34), width=1)

# ---- headline numbers ---------------------------------------------------
stats = [("0.99", "AUC  PatchCore"), ("1.78x", "BERT speedup"), ("150+", "LeetTrack users")]
sx = x
for value, label in stats:
    d.text((sx, 406), value, font=font(MONO_B, 40), fill=CYAN)
    d.text((sx, 458), label, font=font(MONO, 17), fill=DIM)
    sx += 196

# ---- footer line --------------------------------------------------------
d.text((x, 524), "github.com/Neural-GPT", font=font(MONO, 20), fill=MUTED)
d.text((x, 556), "Kanpur Institute of Technology  ·  BCA 2028", font=font(MONO, 18), fill=DIM)

img.save("public/og.png", optimize=True)
print("wrote public/og.png", img.size)
