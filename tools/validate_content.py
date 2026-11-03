"""V1.6 内容结构校验：用 schemas/*.schema.json 的最小实现校验核心数据文件。

不依赖 jsonschema 第三方库（离线环境与 CI 都不必额外安装），支持：
type / required / properties / items / enum / const / minItems / maxItems /
minLength / pattern / minimum / maximum，以及每个文件的主键唯一性检查。

运行：python tools/validate_content.py
通过时退出码 0，并打印每个文件的条目数与规则数；失败时列出全部错误路径。
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
SCHEMAS = ROOT / 'schemas'

TARGETS = [
    ('drug_formulary.json', 'drug.schema.json', 'id'),
    ('lab_reference_ranges.json', 'lab_range.schema.json', 'code'),
    ('quiz_cases.json', 'quiz.schema.json', 'id'),
    ('learning.json', 'learning.schema.json', 'id'),
    ('dose_rules.json', 'dose_rules.schema.json', 'drug_id'),
    ('relations.json', 'relations.schema.json', None),
]


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def check_type(value, expected) -> bool:
    if isinstance(expected, list):
        return any(check_type(value, e) for e in expected)
    if expected == 'object':
        return isinstance(value, dict)
    if expected == 'array':
        return isinstance(value, list)
    if expected == 'string':
        return isinstance(value, str)
    if expected == 'number':
        return isinstance(value, (int, float)) and not isinstance(value, bool)
    if expected == 'integer':
        return isinstance(value, int) and not isinstance(value, bool)
    if expected == 'boolean':
        return isinstance(value, bool)
    if expected == 'null':
        return value is None
    return True


def validate(value, schema: dict, path: str, errors: list[str]) -> None:
    if not isinstance(schema, dict):
        return
    expected = schema.get('type')
    if expected is not None and not check_type(value, expected):
        errors.append(f'{path}: 期望类型 {expected}，实际 {type(value).__name__}')
        return
    if 'const' in schema and value != schema['const']:
        errors.append(f'{path}: 必须等于常量 {schema["const"]!r}，实际 {value!r}')
    if 'enum' in schema and value not in schema['enum']:
        errors.append(f'{path}: 取值 {value!r} 不在允许集合 {schema["enum"]}')
    if isinstance(value, str):
        if 'minLength' in schema and len(value) < schema['minLength']:
            errors.append(f'{path}: 字符串长度 {len(value)} < {schema["minLength"]}')
        if 'pattern' in schema and not re.search(schema['pattern'], value):
            errors.append(f'{path}: 不匹配模式 {schema["pattern"]}')
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if 'minimum' in schema and value < schema['minimum']:
            errors.append(f'{path}: {value} < 最小值 {schema["minimum"]}')
        if 'maximum' in schema and value > schema['maximum']:
            errors.append(f'{path}: {value} > 最大值 {schema["maximum"]}')
    if isinstance(value, dict):
        for key in schema.get('required', []):
            if key not in value:
                errors.append(f'{path}: 缺字段 {key}')
        props = schema.get('properties', {})
        for key, sub in props.items():
            if key in value:
                validate(value[key], sub, f'{path}.{key}', errors)
        extra = schema.get('additionalProperties')
        if isinstance(extra, dict):
            for key in value:
                if key not in props:
                    validate(value[key], extra, f'{path}.{key}', errors)
    if isinstance(value, list):
        if 'minItems' in schema and len(value) < schema['minItems']:
            errors.append(f'{path}: 条目数 {len(value)} < {schema["minItems"]}')
        if 'maxItems' in schema and len(value) > schema['maxItems']:
            errors.append(f'{path}: 条目数 {len(value)} > {schema["maxItems"]}')
        item_schema = schema.get('items')
        if isinstance(item_schema, dict):
            for index, item in enumerate(value):
                validate(item, item_schema, f'{path}[{index}]', errors)


def unique_ids(data: dict, key: str | None) -> dict[str, int]:
    stats = {}
    if isinstance(data.get('items'), list):
        ids = [x.get(key) for x in data['items'] if isinstance(x, dict)]
        stats['items'] = len(ids)
        stats['unique_items'] = len(set(ids))
    if isinstance(data.get('systems'), list):
        ids = [t.get('id') for s in data['systems'] for t in (s.get('topics') or [])]
        stats['topics'] = len(ids)
        stats['unique_topics'] = len(set(ids))
    if isinstance(data.get('index'), dict):
        stats['entities'] = len(data['index'])
        stats['links'] = sum(len(v) for v in data['index'].values() if isinstance(v, list))
    return stats


def main() -> int:
    failures = 0
    for data_name, schema_name, key in TARGETS:
        data_path = DATA / data_name
        schema_path = SCHEMAS / schema_name
        if not data_path.exists():
            print(f'SKIP {data_name}: 文件不存在')
            continue
        if not schema_path.exists():
            print(f'FAIL {data_name}: 缺少 schema {schema_name}')
            failures += 1
            continue
        data = load(data_path)
        schema = load(schema_path)
        errors: list[str] = []
        validate(data, schema, data_name, errors)
        stats = unique_ids(data, key)
        for key in ('items', 'topics'):
            if f'{key}' in stats and stats[key] != stats.get(f'unique_{key}', stats[key]):
                errors.append(f'{data_name}: {key} 主键重复 {stats[key]} vs {stats.get("unique_" + key)}')
        if data_name == 'dose_rules.json':
            for index, item in enumerate(data.get('items') or []):
                for rule in item.get('rules') or []:
                    if not (0 <= rule.get('low', -1) <= rule.get('high', -1)):
                        errors.append(f'dose_rules.json items[{index}] {item.get("drug_id")}: 区间 low/high 次序错误')
        if errors:
            failures += 1
            print(f'FAIL {data_name}: {len(errors)} 处问题')
            for err in errors[:12]:
                print('  -', err)
            if len(errors) > 12:
                print(f'  … 其余 {len(errors) - 12} 处省略')
        else:
            print(f'OK   {data_name}: {stats}')
    print('\n结果：', '全部通过' if failures == 0 else f'{failures} 个文件未通过')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
