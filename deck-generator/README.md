# Deck Generator

This folder contains a Python script to generate a polished PowerPoint deck (AtlasOS_Pitch_Deck_v1.pptx) for the AtlasOS project.

How to use

1. Install dependencies (prefer a virtualenv):

   pip install -r deck-generator/requirements.txt

2. Place your logo at deck-generator/assets/logo.png (optional). Use a square or rectangular PNG. If missing, the script will continue without the logo.

3. (Optional) Add or edit SVG diagrams in deck-generator/assets/diagrams/*.svg. The script will convert SVG files to PNG using cairosvg if available.

4. Run the generator:

   python deck-generator/generate_deck.py

5. Output: AtlasOS_Pitch_Deck_v1.pptx will be produced in the repo root.

Notes
- The script uses python-pptx to assemble slides and embed speaker notes.
- Fonts: the script sets text to Montserrat if available, otherwise falls back to system defaults. For consistent rendering, install Montserrat locally or edit generate_deck.py to use another font.
