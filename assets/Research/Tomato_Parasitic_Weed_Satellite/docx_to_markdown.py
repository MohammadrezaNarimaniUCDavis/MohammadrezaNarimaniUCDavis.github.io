"""
Convert DOCX to Markdown for Satellite paper (SPIE 2025).
Output: Markdown/134750U.md and Markdown/media/
"""
import subprocess
import re
from pathlib import Path

PANDOC_EXE = r"C:\Program Files\Pandoc\pandoc.exe"
REPO_ROOT = Path(__file__).resolve().parent
DOCX_PATH = REPO_ROOT / "DOCX" / "134750U.docx"
MARKDOWN_DIR = REPO_ROOT / "Markdown"
MEDIA_DIR = MARKDOWN_DIR / "media"
OUTPUT_MD = MARKDOWN_DIR / "134750U.md"


def normalize_markdown(md_path: Path) -> None:
    text = md_path.read_text(encoding="utf-8", errors="replace")
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
    text = text.replace("\\'", "'")
    text = re.sub(r'\^([a-zA-Z0-9]+)\^', r'<sup>\1</sup>', text)
    text = re.sub(r'\[([^\]]*)\]\{\.underline\}', r'<u>\1</u>', text)
    md_path.write_text(text, encoding="utf-8")


def main():
    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    if not DOCX_PATH.exists():
        print(f"ERROR: DOCX not found: {DOCX_PATH}")
        return 1
    if not Path(PANDOC_EXE).exists():
        print(f"ERROR: Pandoc not found: {PANDOC_EXE}")
        return 1
    cmd = [
        PANDOC_EXE,
        str(DOCX_PATH),
        "-o", str(OUTPUT_MD),
        "--extract-media", str(MARKDOWN_DIR),
        "--wrap=none",
        "--standalone",
    ]
    print("Running:", " ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(REPO_ROOT))
    if result.returncode != 0:
        print("Pandoc stderr:", result.stderr)
        return result.returncode
    normalize_markdown(OUTPUT_MD)
    print(f"Created: {OUTPUT_MD}")
    if MEDIA_DIR.exists():
        n = len([f for f in MEDIA_DIR.rglob("*") if f.is_file()])
        print(f"Extracted {n} image(s) to: {MEDIA_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
