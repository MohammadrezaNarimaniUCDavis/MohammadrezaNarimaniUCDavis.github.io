# Tomato Parasitic Weed — Satellite Imagery (SPIE 2025)

This folder contains assets for the research page:

**Branched Broomrape Detection in Tomato Farms Using Satellite Imagery and Time-Series Analysis**  
SPIE 2025 — *Autonomous Air and Ground Sensing Systems for Agricultural Optimization and Phenotyping X*, Vol. 13475, 134750U.

- **Assets/** — Conference photo (SPIE 2025 poster presentation).
- **DOCX/** — Source paper (DOCX). **Ignored by git** (licensing).
- **Markdown/** — Converted paper text and figures:
  - `134750U.md` is **ignored by git** (full paper text).
  - `media/` is **tracked** so the website can show figures.

To regenerate Markdown from the DOCX, run from this folder:

```bash
python docx_to_markdown.py
```

Requires Pandoc installed (e.g. `C:\Program Files\Pandoc\pandoc.exe`).
