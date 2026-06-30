"""
generate_deck.py

Generates a polished PowerPoint deck (AtlasOS_Pitch_Deck_v1.pptx) from slide content JSON.
Requirements: python-pptx, pillow, cairosvg (optional for SVG -> PNG conversion)

Run:
  pip install -r requirements.txt
  python generate_deck.py

Outputs: AtlasOS_Pitch_Deck_v1.pptx in the current directory

This script looks for assets/logo.png and assets/diagrams/*.svg (or png). If logo.png is missing, the script continues and leaves slides without the logo.
"""

import json
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
from pptx.util import Cm

try:
    from cairosvg import svg2png
    CAIROSVG_AVAILABLE = True
except Exception:
    CAIROSVG_AVAILABLE = False

from PIL import Image

# Config
OUTPUT = "AtlasOS_Pitch_Deck_v1.pptx"
CONTENT_JSON = os.path.join("deck-generator","slide_content.json")
ASSETS_DIR = os.path.join("deck-generator","assets")
LOGO_PATH = os.path.join(ASSETS_DIR, "logo.png")
DIAGRAMS_DIR = os.path.join(ASSETS_DIR, "diagrams")

# Styling
BG_COLOR = RGBColor(8, 10, 12)  # near black
TITLE_COLOR = RGBColor(255, 255, 255)
TEXT_COLOR = RGBColor(220, 220, 220)
ACCENT_COLOR = RGBColor(0, 229, 179)  # teal
FONT_NAME = "Montserrat, Arial"

# Helpers

def ensure_png_from_svg(svg_path, out_png):
    if not os.path.exists(svg_path):
        return False
    try:
        if CAIROSVG_AVAILABLE:
            svg2png(url=svg_path, write_to=out_png)
            return True
        else:
            # Attempt to rasterize by opening as image (may fail)
            img = Image.open(svg_path)
            img.save(out_png, "PNG")
            return True
    except Exception:
        return False


def add_logo(slide, left=Inches(0.3), top=Inches(0.2), height=Inches(1.0)):
    if os.path.exists(LOGO_PATH):
        slide.shapes.add_picture(LOGO_PATH, left, top, height=height)


def set_background(prs, slide, color):
    # pptx does not provide a direct API to set slide background color for a slide; use fill on shape
    shape = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    fill = shape.fill
    fill.solid()
    fill.fore_color.rgb = color
    shape.line.fill.background()
    shape.shape_id = 1
    shape.z_order = 0


def create_slide(prs, title_text, content_lines, notes=None, diagram=None, layout_type='title_and_content'):
    slide_layout = prs.slide_layouts[5]  # blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Background
    set_background(prs, slide, BG_COLOR)

    # Logo
    try:
        add_logo(slide)
    except Exception:
        pass

    # Title
    left = Inches(1.0)
    top = Inches(1.0)
    width = prs.slide_width - Inches(2.0)
    title_box = slide.shapes.add_textbox(left, top, width, Inches(1.0))
    title_tf = title_box.text_frame
    title_tf.text = title_text
    title_run = title_tf.paragraphs[0].runs[0]
    title_run.font.size = Pt(32)
    title_run.font.bold = True
    title_run.font.name = FONT_NAME
    title_run.font.color.rgb = TITLE_COLOR

    # Content
    content_top = Inches(2.2)
    content_box = slide.shapes.add_textbox(left, content_top, width * 0.6, Inches(4.0))
    content_tf = content_box.text_frame
    content_tf.word_wrap = True
    for i, line in enumerate(content_lines):
        if i == 0:
            p = content_tf.paragraphs[0]
            p.text = line
        else:
            p = content_tf.add_paragraph()
            p.text = line
        p.level = 0
        p.font.size = Pt(16)
        p.font.name = FONT_NAME
        p.font.color.rgb = TEXT_COLOR

    # Diagram area
    if diagram:
        # diagram can be svg or png in DIAGRAMS_DIR
        svg_path = os.path.join(DIAGRAMS_DIR, diagram)
        png_path = os.path.join(DIAGRAMS_DIR, os.path.splitext(diagram)[0] + ".png")
        if diagram.lower().endswith('.svg'):
            ok = ensure_png_from_svg(svg_path, png_path)
        else:
            png_path = svg_path
            ok = os.path.exists(png_path)

        if ok and os.path.exists(png_path):
            pic_left = left + width * 0.62
            pic_top = content_top
            pic_width = prs.slide_width - pic_left - Inches(1.0)
            # Add picture with preserved aspect ratio (use height)
            slide.shapes.add_picture(png_path, pic_left, pic_top, width=pic_width)

    # Speaker notes
    if notes:
        notes_slide = slide.notes_slide
        notes_text_frame = notes_slide.notes_text_frame
        notes_text_frame.text = notes

    return slide


def main():
    # Load slide content JSON
    with open(CONTENT_JSON, 'r', encoding='utf-8') as f:
        doc = json.load(f)

    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)

    for slide in doc.get('slides', []):
        title = slide.get('title', '')
        content = slide.get('content', [])
        notes = slide.get('notes', '')
        diagram = slide.get('diagram')
        create_slide(prs, title, content, notes=notes, diagram=diagram)

    output_path = OUTPUT
    prs.save(output_path)
    print(f"Saved {output_path}")


if __name__ == '__main__':
    main()
