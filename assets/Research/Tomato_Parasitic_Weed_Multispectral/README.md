# Tomato Parasitic Weed Multispectral — Research Assets

SPIE 2024 paper: **Drone-based multispectral imaging and deep learning for timely detection of branched broomrape in tomato farms**  
DOI: [10.1117/12.3021219](https://doi.org/10.1117/12.3021219)

## Licensing note

**DOCX/** and **Markdown/1305304.md** are in `.gitignore` and are not pushed to GitHub (conference licensing). Keep them only locally. The script and **Markdown/media/** (figures) stay in the repo so the public research page can display the figures.

## Folder structure

| Folder / file | In repo? | Contents |
|---------------|----------|----------|
| **Assets/** | Yes | SPIE 2024 presentation photo; paper figures can be copied from Markdown/media. |
| **DOCX/** | No (gitignored) | Source manuscript `1305304.docx`. Local only. |
| **Markdown/** | Partially | `1305304.md` is gitignored. **media/** (figures) is in repo for the website. |
| **docx_to_markdown.py** | Yes | Script to convert DOCX → Markdown. Run locally. |

## Run conversion (local only)

From this directory:

```bash
python docx_to_markdown.py
```

Requires Pandoc at `C:\Program Files\Pandoc\pandoc.exe`. Output: `Markdown/1305304.md` and `Markdown/media/` (figures). Do not commit the generated `.md` (full paper text).

## Live page

Research summary and figures:  
[pages/research/Tomato_Parasitic_Weed_Multispectral/](https://mohammadrezanarimaniucdavis.github.io/pages/research/Tomato_Parasitic_Weed_Multispectral/)
