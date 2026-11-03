"""校验 IPA 包结构：解压后检查 Payload/*.app 的 Info.plist、Mach-O 可执行文件与签名描述文件。

用法：
    python tools/verify_ipa_bundle.py <path/to/app.ipa>
    python tools/verify_ipa_bundle.py <path/to/Payload/xxx.app>

检查项：
1. 包内存在 Payload/*.app 目录
2. Info.plist 可解析，含 CFBundleIdentifier / CFBundleExecutable / CFBundleVersion
3. 可执行文件存在且是 Mach-O（魔数 0xfeedface / 0xfeedfacf / 0xcafebabe / fat）
4. embedded.mobileprovision 是否存在（签名后的 IPA 应有；unsigned 版会提示）
5. 若存在 mobileprovision，尽力解析出 TeamIdentifier / 过期时间（文本扫描，不依赖 plist 库）
退出码 0 表示结构可用。
"""
from __future__ import annotations

import plistlib
import re
import struct
import sys
import tempfile
import zipfile
from pathlib import Path

MACHO_MAGIC = {0xFEEDFACE, 0xFEEDFACF, 0xCEFAEDFE, 0xCFFAEDFE, 0xCAFEBABE, 0xBEBAFECA, 0xCAFEBABF}


def read_plist_bytes(data: bytes) -> dict:
    return plistlib.loads(data)


def check_app_dir(app: Path) -> int:
    info_path = app / 'Info.plist'
    if not info_path.exists():
        print(f'FAIL 缺少 Info.plist: {info_path}')
        return 1
    info = read_plist_bytes(info_path.read_bytes())
    bundle_id = info.get('CFBundleIdentifier')
    exe_name = info.get('CFBundleExecutable')
    print(f'Info.plist: bundle={bundle_id} version={info.get("CFBundleVersion")} exe={exe_name}')
    if not bundle_id or not exe_name:
        print('FAIL Info.plist 缺少 CFBundleIdentifier 或 CFBundleExecutable')
        return 1
    exe = app / exe_name
    if not exe.exists():
        print(f'FAIL 可执行文件不存在: {exe}')
        return 1
    with exe.open('rb') as fh:
        magic = struct.unpack('>I', fh.read(4))[0]
    if magic not in MACHO_MAGIC:
        print(f'FAIL 不是 Mach-O 可执行文件（magic=0x{magic:08x}）')
        return 1
    print('Mach-O 可执行文件：OK')

    profile = app / 'embedded.mobileprovision'
    if profile.exists():
        text = profile.read_bytes()
        team = re.findall(rb'<key>TeamIdentifier</key>\s*<array>\s*<string>([^<]+)', text)
        expiry = re.search(rb'<key>ExpirationDate</key>\s*<date>([^<]+)', text)
        uuid = re.search(rb'<key>UUID</key>\s*<string>([^<]+)', text)
        print(f'签名描述文件：OK  team={[b.decode() for b in team]} expiry={expiry.group(1).decode() if expiry else "?"} uuid={uuid.group(1).decode() if uuid else "?"}')
        if expiry and b'20' in expiry.group(1):
            print('提示：免费 Apple ID 签名 7 天过期，到期需重新签名安装。')
    else:
        print('提示：未找到 embedded.mobileprovision，这是未签名包；需用爱思助手/Xcode/CI 签名后才能安装。')
    return 0


def main() -> int:
    if len(sys.argv) != 2:
        print('用法：python tools/verify_ipa_bundle.py <app.ipa|Payload/xxx.app>')
        return 2
    target = Path(sys.argv[1])
    if not target.exists():
        print(f'FAIL 文件不存在：{target}')
        return 1
    if target.is_dir() and target.suffix == '.app':
        return check_app_dir(target)
    with tempfile.TemporaryDirectory() as tmp:
        with zipfile.ZipFile(target) as zf:
            names = zf.namelist()
            apps = sorted({n.split('/')[1] for n in names if n.startswith('Payload/') and n.count('/') >= 2 and n.split('/')[1].endswith('.app')})
            if not apps:
                print('FAIL IPA 内没有 Payload/*.app')
                return 1
            zf.extractall(tmp)
        results = [check_app_dir(Path(tmp) / 'Payload' / app) for app in apps]
        print(f'\n结论：{len(apps)} 个 .app，{"结构可用" if all(r == 0 for r in results) else "存在问题"}')
        return 0 if all(r == 0 for r in results) else 1


if __name__ == '__main__':
    sys.exit(main())
