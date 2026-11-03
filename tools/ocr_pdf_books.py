"""扫描版 PDF 逐页 OCR（Windows 自带中文 OCR），可中断续跑。

原理：PyMuPDF 把页面渲染成 PNG（快），再用 Windows.Media.Ocr 识别中文（无需装 tesseract / 模型），
每页结果写一个 txt，已存在则跳过，因此中断可续跑。

用法：
    python tools/ocr_pdf_books.py --pdf data/library/raw/诸福棠实用儿科学第9版上.pdf --book-id zhufutang9a
    python tools/ocr_pdf_books.py --pdf ... --start 300 --end 400 --dpi 200
    python tools/ocr_pdf_books.py --pdf ... --force        # 重跑已存在页

输出：data/library/ocr/<book_id>/p000123.txt
依赖：pymupdf；Windows 10/11（已装中文 OCR 语言包：zh-Hans-CN）
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OCR_ROOT = ROOT / 'data' / 'library' / 'ocr'
PS1 = ROOT / 'tools' / 'win_ocr_folder.ps1'


def render_batch(doc, pages: list[int], tmp_dir: Path, dpi: int) -> None:
    for page_no in pages:
        pix = doc[page_no - 1].get_pixmap(dpi=dpi)
        pix.save(str(tmp_dir / f'p{page_no:06d}.png'))


def run_ps(in_dir: Path, out_dir: Path) -> None:
    subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass',
                    '-File', str(PS1), '-InDir', str(in_dir), '-OutDir', str(out_dir)],
                   check=True, stdout=subprocess.DEVNULL)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf', required=True)
    parser.add_argument('--book-id', required=True)
    parser.add_argument('--dpi', type=int, default=200)
    parser.add_argument('--batch', type=int, default=80, help='每批渲染页数')
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=0)
    parser.add_argument('--force', action='store_true')
    args = parser.parse_args()

    import pymupdf

    pdf = Path(args.pdf)
    if not pdf.exists():
        raise SystemExit(f'找不到 PDF：{pdf}')
    out_dir = OCR_ROOT / args.book_id
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_root = out_dir / '_tmp'
    tmp_root.mkdir(exist_ok=True)

    doc = pymupdf.open(str(pdf))
    total = doc.page_count
    end = min(args.end or total, total)
    pages = [n for n in range(max(1, args.start), end + 1)]
    if not args.force:
        pages = [n for n in pages if not (out_dir / f'p{n:06d}.txt').exists()]
    print(f'{pdf.name}: {total} 页，待处理 {len(pages)} 页，dpi={args.dpi}，batch={args.batch}', flush=True)

    started = time.time()
    done = 0
    for offset in range(0, len(pages), args.batch):
        chunk = pages[offset:offset + args.batch]
        tmp_dir = tmp_root / f'b{offset//args.batch:05d}'
        if tmp_dir.exists():
            shutil.rmtree(tmp_dir, ignore_errors=True)
        tmp_dir.mkdir(parents=True, exist_ok=True)
        render_batch(doc, chunk, tmp_dir, args.dpi)
        run_ps(tmp_dir, out_dir)
        chars = sum((out_dir / f'p{n:06d}.txt').stat().st_size for n in chunk
                    if (out_dir / f'p{n:06d}.txt').exists())
        done += len(chunk)
        elapsed = time.time() - started
        rate = done / elapsed if elapsed else 0
        remain = (len(pages) - done) / rate if rate else 0
        print(f'  {done}/{len(pages)} 页 · {rate:.2f} 页/秒 · 累计 {chars} 字节 · '
              f'预计剩余 {remain/60:.1f} 分钟', flush=True)
        shutil.rmtree(tmp_dir, ignore_errors=True)
    shutil.rmtree(tmp_root, ignore_errors=True)
    print(f'完成：{done} 页，耗时 {(time.time()-started)/60:.1f} 分钟', flush=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
