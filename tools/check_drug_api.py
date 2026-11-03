"""检查已配置的药品数据源是否可用（不回显 Key）。

用法：
    python tools/check_drug_api.py                 # 查「阿莫西林」
    python tools/check_drug_api.py --q 布洛芬 --page 1
    python tools/check_drug_api.py --raw           # 额外打印原始 JSON 结构，便于写字段映射

读取顺序：进程环境变量 → .env（如果存在且 python-dotenv 未安装则简单解析）。
退出码 0 表示连通且能映射出至少一条 Drug。
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


def load_env() -> None:
    """极简 .env 解析：只填尚未存在于环境变量里的键，避免覆盖。"""
    path = ROOT / '.env'
    if not path.exists():
        return
    for line in path.read_text(encoding='utf-8', errors='ignore').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        if key and key not in os.environ:
            os.environ[key] = value.strip().strip('"').strip("'")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--q', default='阿莫西林')
    parser.add_argument('--page', type=int, default=1)
    parser.add_argument('--raw', action='store_true', help='打印原始返回结构（截断）')
    args = parser.parse_args()

    load_env()
    try:
        from app import main as app_main  # noqa: WPS433
    except Exception as exc:  # pragma: no cover - 依赖缺失时给出明确提示
        print('无法导入 app.main：', exc)
        print('请先安装依赖：python -m pip install -r requirements.txt')
        return 2

    chosen = app_main.provider()
    print('当前数据源：', chosen or '未配置（将回退离线药典）')
    print('自建接口已配置：', app_main.custom_ready())
    if not chosen:
        print('提示：填 .env 里的 CUSTOM_DRUG_API_* 或 TIANAPI_KEY / MOSENG_API_KEY 后重跑。')
        return 1

    async def run():
        if chosen == 'custom':
            return await app_main.custom_fetch(args.q, args.page)
        if chosen == 'tianapi':
            import httpx
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(app_main.TIANAPI_URL, data={
                    'key': app_main.get_value('TIANAPI_KEY'),
                    'word': args.q, 'num': '10', 'page': str(args.page)})
                response.raise_for_status()
                return response.json()
        return await app_main.moseng_post(app_main.MOSENG_INSTRUCTIONS_URL, {
            'search': {'drug_name': args.q}, 'page': args.page})

    payload = asyncio.run(run())
    if args.raw:
        text = json.dumps(payload, ensure_ascii=False, indent=2)
        print(text[:3000] + ('\n…（截断）' if len(text) > 3000 else ''))

    if chosen == 'custom':
        records = app_main.normalize_custom(payload, args.q)
    elif chosen == 'tianapi':
        records = app_main.normalize_tianapi(payload, args.q)
    else:
        records = app_main.normalize_moseng(payload)

    print(f'映射结果：{len(records)} 条')
    for record in records[:3]:
        print(f"- {record.name} | 厂家={record.manufacturer} | 批文={record.approval_number} | 章节={len(record.sections)}")
    if not records:
        print('未映射出条目：用 --raw 看返回结构，再把 CUSTOM_DRUG_API_LIST_PATH / FIELD_MAP 对上。')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
