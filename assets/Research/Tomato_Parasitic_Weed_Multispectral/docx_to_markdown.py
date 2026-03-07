"""
Convert DOCX to Markdown using Pandoc, preserving images and section order.
Output: Markdown/*.md and Markdown/media/ (extracted images).
Image paths in the .md are normalized to relative (media/...) for portability.
"""
import subprocess
import os
import re
from pathlib import Path

# Paths
PANDOC_EXE = r"C:\Program Files\Pandoc\pandoc.exe"
REPO_ROOT = Path(__file__).resolve().parent
DOCX_PATH = REPO_ROOT / "DOCX" / "1305304.docx"
MARKDOWN_DIR = REPO_ROOT / "Markdown"
MEDIA_DIR = MARKDOWN_DIR / "media"
OUTPUT_MD = MARKDOWN_DIR / "1305304.md"


def fix_formulas_tables_formatting(text: str) -> str:
    """Fix Pandoc output so formulas, tables, and inline formatting render correctly."""

    # ---- 1. Underline first (so later patterns see <u>...</u>)
    text = re.sub(r'\[([^\]]*)\]\{\.underline\}', r'<u>\1</u>', text)

    # ---- 2. Superscripts: ^x^ → <sup>x</sup>
    text = re.sub(r'\^\\\*a\^', '<sup>*a</sup>', text)
    text = re.sub(r'\^\\\*\^', '<sup>*</sup>', text)
    text = re.sub(r'\^([a-zA-Z0-9]+)\^', r'<sup>\1</sup>', text)

    # ---- 3. Equation 1 (GDD): broken fraction → one line
    # After step 1 we have <u>−</u> and <u>n</u> or <u>𝑛</u> (unicode math n)
    text = re.sub(
        r'> 𝐺𝐷𝐷 = 𝑇𝑚𝑎𝑥 <u>−</u> 𝑇𝑚𝑖<u>[^<]+</u> − 𝑇\s*\n\s*>?\s*\n\s*> \\\(1\\\)\s*\n\s*>?\s*\n\s*> 2 𝑏𝑎𝑠𝑒',
        '> 𝐺𝐷𝐷 = (Tmax + Tmin) / 2 − Tbase  (1)',
        text,
        flags=re.DOTALL
    )
    # If still present with original .underline
    text = re.sub(
        r'> 𝐺𝐷𝐷 = 𝑇𝑚𝑎𝑥 \[−\]\{\.underline\} 𝑇𝑚𝑖\[[^\]]*\]\{\.underline\} − 𝑇\s*\n\s*>?\s*\n\s*> \\\(1\\\)\s*\n\s*>?\s*\n\s*> 2 𝑏𝑎𝑠𝑒',
        '> 𝐺𝐷𝐷 = (Tmax + Tmin) / 2 − Tbase  (1)',
        text,
        flags=re.DOTALL
    )

    # ---- 4. Equation 2 (SAVI): compact to one line (allow unicode or ASCII parentheses)
    text = re.sub(
        r'> 𝑆𝐴𝑉𝐼 = \(𝑁𝐼𝑅 − 𝑅𝐸𝐷\)\s*\n\s*> \(𝑁𝐼𝑅 \+ 𝑅𝐸𝐷 \+ 𝐿\)\s*\n\s*> × \(1 \+ 𝐿\) \(2\)',
        '> 𝑆𝐴𝑉𝐼 = (𝑁𝐼𝑅 − 𝑅𝐸𝐷) / (𝑁𝐼𝑅 + 𝑅𝐸𝐷 + 𝐿) × (1 + 𝐿)  (2)',
        text,
        flags=re.DOTALL
    )
    # SAVI with unicode parentheses (e.g. from Word)
    text = re.sub(
        r'> 𝑆𝐴𝑉𝐼 = .*?𝑁𝐼𝑅 − 𝑅𝐸𝐷.*?\s*\n\s*> .*?𝑁𝐼𝑅 \+ 𝑅𝐸𝐷 \+ 𝐿.*?\s*\n\s*> × .*?1 \+ 𝐿.*? \(2\)',
        '> 𝑆𝐴𝑉𝐼 = (𝑁𝐼𝑅 − 𝑅𝐸𝐷) / (𝑁𝐼𝑅 + 𝑅𝐸𝐷 + 𝐿) × (1 + 𝐿)  (2)',
        text,
        flags=re.DOTALL
    )

    # ---- 5. Recall (3) - denominator on separate line without ">"
    text = re.sub(
        r'> 𝑅𝑒𝑐𝑎𝑙𝑙 = 𝑇𝑃\s*\n\s*\n\s*𝑇𝑃 \+ 𝐹𝑁\s*\n\s*> \\\(3\\\)',
        '> 𝑅𝑒𝑐𝑎𝑙𝑙 = *TP* / (*TP* + *FN*)  (3)',
        text,
        flags=re.DOTALL
    )

    # ---- 6. Precision (4)
    text = re.sub(
        r'> 𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 = 𝑇𝑃\s*\n\s*\n\s*𝑇𝑃 \+ 𝐹𝑃\s*\n\s*> \\\(4\\\)',
        '> 𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 = *TP* / (*TP* + *FP*)  (4)',
        text,
        flags=re.DOTALL
    )

    # ---- 7. F1-Score (5) - denominator line has "> " prefix
    text = re.sub(
        r'> 𝐹1 𝑆𝑐𝑜𝑟𝑒 = 2 × 𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 × 𝑅𝑒𝑐𝑎𝑙𝑙\s*\n\s*>?\s*\n\s*> 𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 \+ 𝑅𝑒𝑐𝑎𝑙𝑙\s*\n\s*>?\s*\n\s*> \\\(5\\\)',
        '> 𝐹1-Score = 2 × (𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 × 𝑅𝑒𝑐𝑎𝑙𝑙) / (𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 + 𝑅𝑒𝑐𝑎𝑙𝑙)  (5)',
        text,
        flags=re.DOTALL
    )

    # ---- 8. Overall Accuracy (6) - denominator line has "> " prefix
    text = re.sub(
        r'> 𝑂𝑣𝑒𝑟𝑎𝑙𝑙 𝐴𝑐𝑐𝑢𝑟𝑎𝑐𝑦 = 𝑇𝑃 \+ 𝑇𝑁\s*\n\s*> 𝑇𝑃 \+ 𝑇𝑁 \+ 𝐹𝑃 \+ 𝐹𝑁\s*\n\s*>?\s*\n\s*> \\\(6\\\)',
        '> 𝑂𝑣𝑒𝑟𝑎𝑙𝑙 𝐴𝑐𝑐𝑢𝑟𝑎𝑐𝑦 = (*TP* + *TN*) / (*TP* + *TN* + *FP* + *FN*)  (6)',
        text,
        flags=re.DOTALL
    )

    # ---- 9. Standalone equation numbers: \(n\) → (n) so they render normally
    text = re.sub(r'\\\((\d+)\)', r'(\1)', text)
    text = re.sub(r'\\\(b\)', r'(b)', text)

    return text


def normalize_markdown(md_path: Path) -> None:
    """Replace absolute image paths with relative media/ paths; clean escaped quotes; fix formulas/tables."""
    text = md_path.read_text(encoding="utf-8", errors="replace")

    # Replace absolute paths to media files with relative "media/filename"
    text = re.sub(
        r'!\[\][^(]*\(\s*[^)]*[/\\]media[/\\]([^)]+)\)\{[^}]*\}',
        r'![](media/\1)',
        text
    )
    text = re.sub(
        r'!\[\][^(]*\([^)]*[/\\](media[/\\][^)]+)\)',
        lambda m: '![](' + m.group(1).replace('\\', '/') + ')',
        text
    )
    text = re.sub(r'\)\{width="[^"]*" height="[^"]*"\}', ')', text)

    # Clean escaped single quotes from Word
    text = text.replace("\\'", "'")

    # Fix formulas, superscripts, underlines, and equation layout
    text = fix_formulas_tables_formatting(text)

    md_path.write_text(text, encoding="utf-8")


def main():
    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)

    if not DOCX_PATH.exists():
        print(f"ERROR: DOCX not found: {DOCX_PATH}")
        return 1

    if not Path(PANDOC_EXE).exists():
        print(f"ERROR: Pandoc not found: {PANDOC_EXE}")
        return 1

    # Extract media into Markdown so image paths in .md are media/...
    extract_media = str(MARKDOWN_DIR)

    cmd = [
        PANDOC_EXE,
        str(DOCX_PATH),
        "-o", str(OUTPUT_MD),
        "--extract-media", extract_media,
        "--wrap=none",
        "--standalone",
    ]

    print("Running:", " ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(REPO_ROOT))

    if result.returncode != 0:
        print("Pandoc stderr:", result.stderr)
        print("Pandoc stdout:", result.stdout)
        return result.returncode

    normalize_markdown(OUTPUT_MD)
    print(f"Created: {OUTPUT_MD} (image paths normalized to relative)")

    if MEDIA_DIR.exists():
        images = [f for f in MEDIA_DIR.rglob("*") if f.is_file()]
        print(f"Extracted {len(images)} image(s) to: {MEDIA_DIR}")
    else:
        print("No images extracted (docx may have no embedded images).")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
