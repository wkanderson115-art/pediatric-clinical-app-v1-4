r"""按书名预置 + 直链/本地文件 自动导入电子书到离线书库。

用法：
    # 已有本地文件（推荐：文件放哪都行）
    python tools/fetch_import_books.py --preset zhufutang9 --file D:\迅雷下载\zhufutang9.pdf
    # 有直链（夸克/网盘直链、出版社下载地址均可）
    python tools/fetch_import_books.py --preset zhufutang9 --url "https://....pdf"
    # 先下到 data/library/raw 再统一扫描导入
    python tools/fetch_import_books.py --download-only --preset peds_dose5 --url "https://....pdf"

预置（四本指定书 + 通用）：
    zhufutang9a / zhufutang9b  诸福棠实用儿科学（第9版）上下册
    lab_report                 临床检验报告解读（石同才）
    peds_resident              儿科住院医师手册（齐建光 闫辉 张欣）
    peds_dose5                 实用儿科药物剂量速查手册（第5版，李振芳）
    generic                    任意书，需 --title

支持 PDF（需 pypdf 或 pdftotext）、EPUB、TXT/MD；下载会校验 %PDF 魔数与最小体积。
导入后自动同步 web/library/，需要 App 内联时再跑 tools/build_inline_data.py。
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'data' / 'library' / 'raw'
RAW.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'tools'))

PRESETS = {
    'zhufutang9a': {'title': '诸福棠实用儿科学（第9版·上册）', 'authors': '王天有 申昆玲 沈颖', 'publisher': '人民卫生出版社', 'year': '2024', 'edition': '9'},
    'zhufutang9b': {'title': '诸福棠实用儿科学（第9版·下册）', 'authors': '王天有 申昆玲 沈颖', 'publisher': '人民卫生出版社', 'year': '2024', 'edition': '9'},
    'lab_report': {'title': '临床检验报告解读', 'authors': '石同才', 'publisher': '科学出版社', 'year': '', 'edition': '1'},
    'peds_resident': {'title': '儿科住院医师手册', 'authors': '齐建光 闫辉 张欣', 'publisher': '北京大学医学出版社', 'year': '', 'edition': ''},
    'peds_dose5': {'title': '实用儿科药物剂量速查手册（第5版）', 'authors': '李振芳', 'publisher': '中国医药科技出版社', 'year': '2018', 'edition': '5'},
    'nice_ng1': {'title': 'NICE NG1 儿童胃食管反流病（英文指南）', 'authors': 'NICE', 'publisher': 'NICE', 'year': '2019', 'edition': ''},
}


def download(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
    })
    with urllib.request.urlopen(req, timeout=120) as resp, open(dest, 'wb') as fh:
        shutil.copyfileobj(resp, fh)
    data = dest.read_bytes()
    if len(data) < 50_000:
        raise SystemExit(f'下载文件过小（{len(data)} 字节），可能不是完整 PDF：{dest}')
    if not data.startswith(b'%PDF'):
        dest.unlink(missing_ok=True)
        raise SystemExit('下载内容不是 PDF（缺少 %PDF 魔数），可能命中了登录页/错误页。')
    print(f'下载完成：{dest}（{len(data)} 字节）')
    return dest


def import_file(path: Path, preset: str | None, title: str | None) -> None:
    meta = dict(PRESETS.get(preset or '', {}))
    if title:
        meta['title'] = title
    if not meta.get('title'):
        meta['title'] = path.stem
    args = [sys.executable, str(ROOT / 'tools' / 'import_library.py'), str(path),
            '--id', preset or path.stem.lower(), '--title', meta['title'],
            '--authors', meta.get('authors', ''), '--publisher', meta.get('publisher', ''),
            '--year', str(meta.get('year', '')), '--edition', str(meta.get('edition', ''))]
    print('导入：', ' '.join(args[1:]))
    subprocess.run(args, check=True, cwd=str(ROOT))


def main() -> int:
    ap = argparse.ArgumentParser(description='按预置书名下载/导入电子书')
    ap.add_argument('--preset', help='预置 id：' + ' / '.join(PRESETS))
    ap.add_argument('--url', help='PDF 直链')
    ap.add_argument('--file', help='本地文件路径')
    ap.add_argument('--title', help='任意书的标题（配合 --file/--url）')
    ap.add_argument('--download-only', action='store_true', help='只下载到 data/library/raw，不导入')
    ap.add_argument('--scan', action='store_true', help='导入 raw 目录下所有文件')
    args = ap.parse_args()

    if args.scan:
        subprocess.run([sys.executable, str(ROOT / 'tools' / 'import_library.py'), '--scan'], check=True, cwd=str(ROOT))
        return 0

    target = None
    if args.file:
        target = Path(args.file).expanduser()
        if not target.exists():
            raise SystemExit(f'找不到文件：{target}')
        if args.download_only:
            raise SystemExit('--download-only 只配合 --url 使用')
    elif args.url:
        suffix = Path(args.url.split('?')[0]).suffix or '.pdf'
        name = (args.preset or 'book') + suffix
        target = RAW / name
        download(args.url, target)
        if args.download_only:
            print('已保存到', target)
            return 0
    else:
        print('用法：--preset <id> --file <路径>  或  --preset <id> --url <直链>  或  --scan')
        return 2

    import_file(target, args.preset, args.title)
    print('\n下一步（要让 App 内联生效）：python tools/build_inline_data.py')
    return 0


if __name__ == '__main__':
    sys.exit(main())
