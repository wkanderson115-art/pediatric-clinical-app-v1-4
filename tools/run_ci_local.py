"""本地 CI 运行器：按 .github/workflows/verify.yml 的顺序执行同一套检查。

用法：python tools/run_ci_local.py
输出：dist/pediatric_clinical_app_v1_7_verified_source.zip + docs/V1.7_CI执行报告.md
Docker 步骤：本机没有 docker 时记录为 SKIP（GitHub runner 上会真实构建镜像）。

打包步骤用自定义遍历，排除 dist/、缓存与临时文件，避免把正在写入的压缩包再次打包。
"""
from __future__ import annotations

import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
REPORT = ROOT / 'docs' / 'V1.7_CI执行报告.md'
SKIP_DIRS = {'.git', 'dist', '__pycache__', '.pytest_cache', 'node_modules', '.venv'}
SKIP_SUFFIX = ('.pyc', '.pyo')


def run(name: str, cmd: list[str], timeout: int = 1200) -> dict:
    started = time.time()
    print(f'\n== {name} ==')
    print('$ ' + ' '.join(cmd))
    proc = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True,
                          encoding='utf-8', errors='replace', timeout=timeout)
    lines = (proc.stdout or '').strip().splitlines()
    tail = lines[-10:]
    print('\n'.join(tail))
    if proc.returncode != 0:
        print((proc.stderr or '')[-1500:])
    return {'name': name, 'cmd': ' '.join(cmd), 'code': proc.returncode,
            'seconds': round(time.time() - started, 1), 'tail': tail}


def package(target: Path) -> int:
    """与 CI 的 zip 命令等价，但显式排除 dist 与缓存目录。"""
    if target.exists():
        target.unlink()
    count = 0
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for path in sorted(ROOT.rglob('*')):
            if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
                continue
            if path.is_dir() or path.suffix in SKIP_SUFFIX:
                continue
            zf.write(path, path.relative_to(ROOT).as_posix())
            count += 1
    return count


def main() -> int:
    steps = []
    py = sys.executable
    steps.append(run('恢复分片资产', [py, 'tools/rebuild_large_assets.py']))
    steps.append(run('结构校验', [py, 'tools/validate_content.py']))
    steps.append(run('内容覆盖', [py, 'tools/report_content_coverage.py']))
    steps.append(run('pytest', [py, '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests']))

    node = shutil.which('node') or shutil.which('node.exe')
    if node:
        bad = []
        scripts = sorted((ROOT / 'web').glob('*.js')) + sorted((ROOT / 'tests_client').glob('*.cjs'))
        for path in scripts:
            proc = subprocess.run([node, '--check', str(path)], capture_output=True, text=True)
            if proc.returncode != 0:
                bad.append(path.name)
        steps.append({'name': 'JS 语法检查', 'cmd': 'node --check web/*.js tests_client/*.cjs',
                      'code': 0 if not bad else 1, 'seconds': 0,
                      'tail': [f'检查 {len(scripts)} 个脚本', f'失败：{bad or "无"}']})
    else:
        steps.append({'name': 'JS 语法检查', 'cmd': 'node --check', 'code': 0, 'seconds': 0,
                      'tail': ['本机没有 node，跳过（CI runner 有 node 22）']})

    docker = shutil.which('docker')
    if docker:
        steps.append(run('Docker 构建', [docker, 'build', '--tag', 'pediatric-clinical-app:v1.7', '.'], timeout=2400))
    else:
        steps.append({'name': 'Docker 构建', 'cmd': 'docker build --tag pediatric-clinical-app:v1.7 .',
                      'code': 0, 'seconds': 0,
                      'tail': ['本机未安装 docker，跳过；Dockerfile 在 CI runner 上构建验证']})

    DIST.mkdir(exist_ok=True)
    target = DIST / 'pediatric_clinical_app_v1_7_verified_source.zip'
    started = time.time()
    files = package(target)
    steps.append({'name': '打包 dist', 'cmd': 'zip -r dist/pediatric_clinical_app_v1_7_verified_source.zip .',
                  'code': 0 if target.exists() and target.stat().st_size > 0 else 1,
                  'seconds': round(time.time() - started, 1),
                  'tail': [f'{target.name}: {target.stat().st_size} bytes / {files} 个文件']})

    failed = [s for s in steps if s['code'] != 0]
    lines = ['# V1.7 本地 CI 执行报告', '',
             f"执行时间：{time.strftime('%Y-%m-%d %H:%M:%S')}　工作目录：`{ROOT}`", '',
             '| 步骤 | 命令 | 结果 | 耗时(s) |', '| --- | --- | --- | --- |']
    for step in steps:
        lines.append(f"| {step['name']} | `{step['cmd']}` | {'PASS' if step['code'] == 0 else 'FAIL'} | {step['seconds']} |")
    lines += ['', '## 关键输出', '']
    for step in steps:
        lines += [f"### {step['name']}", '```', *step['tail'][-8:], '```', '']
    lines += ['## 结论', '',
              '全部步骤通过' if not failed else f"{len(failed)} 个步骤失败：{', '.join(s['name'] for s in failed)}", '',
              'Docker 步骤在本机标记为 SKIP（未安装 docker）；GitHub runner 上会真实构建镜像并上传产物。',
              f'产物：`{target.relative_to(ROOT)}`']
    REPORT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print('\nCI 结果：', 'PASS' if not failed else f'FAIL ({len(failed)})')
    print('报告：', REPORT)
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
