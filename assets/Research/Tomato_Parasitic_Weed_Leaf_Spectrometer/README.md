# Tomato Parasitic Weed Leaf Spectrometer — Research Assets

IFAC-PapersOnLine 2025: **Early detection of branched broomrape (*Phelipanche ramosa*) infestation in tomato crops by using leaf spectral analysis and machine learning**  
Presented at AGRICONTROL 2025, Davis, California, August 27–29, 2025.

## Licensing note

**DOCX/** and **Markdown/1-s2.0-S2405896325024711-main.md** are in `.gitignore` and are not pushed to GitHub (publisher licensing). Keep them only locally. **Markdown/media/** (figures) remains in the repo for reference; the public research page uses the story in `pages/research/Tomato_Parasitic_Weed_Leaf_Spectrometer/`.

## Folder structure

| Folder / file | In repo? | Contents |
|---------------|----------|----------|
| **Assets/** | Yes | IFAC 2025 conference presentation photo. |
| **DOCX/** | No (gitignored) | Source manuscript. Local only. |
| **Markdown/** | Partially | `1-s2.0-S2405896325024711-main.md` is gitignored. **media/** (figures) is in repo. |
| **docx_to_markdown.py** | Yes | Script to convert DOCX → Markdown. Run locally. |

## Run conversion (local only)

From this directory:

```bash
python docx_to_markdown.py
```

Requires Pandoc. Output: `Markdown/1-s2.0-S2405896325024711-main.md` and `Markdown/media/`. Do not commit the generated `.md`.

## Live page

[pages/research/Tomato_Parasitic_Weed_Leaf_Spectrometer/](https://mohammadrezanarimaniucdavis.github.io/pages/research/Tomato_Parasitic_Weed_Leaf_Spectrometer/)
