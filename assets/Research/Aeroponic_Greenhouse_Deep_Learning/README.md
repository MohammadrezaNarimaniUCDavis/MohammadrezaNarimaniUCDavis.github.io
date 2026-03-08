# Aeroponic Greenhouse & Deep Learning (ASABE 2021)

This folder contains assets for the research page:

**Developing an aeroponic smart experimental greenhouse for controlling irrigation and plant disease detection using deep learning and IoT**  
2021 ASABE Annual International Virtual Meeting · Paper 2101252.

- **Assets/** — Conference/poster image (ASABE 2021 online presentation).
- **DOCX/** — Source paper (DOCX). **Ignored by git** (licensing).
- **Markdown/** — Converted paper text and figures:
  - `azdez.asp.md` is **ignored by git** (full paper text).
  - `media/` is **tracked** so the website can show figures.

To regenerate Markdown from the DOCX, run from this folder:

```bash
python docx_to_markdown.py
```

Requires Pandoc installed (e.g. `C:\Program Files\Pandoc\pandoc.exe`).
