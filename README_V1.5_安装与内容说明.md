# V1.5 安装与内容说明

本文件说明：怎么把 V1.5 跑起来、离线内容和在线 API 各自负责什么、Key 怎么管、
以及验收时必须跑哪些命令。医学边界见 `docs/功能测试与医学限制.md` 与 `更新记录_V1.5.md`。

## 一、三种运行方式

### 1. 本机预览（最快）

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

浏览器打开 `http://127.0.0.1:8000/`。不配置任何 Key 也能使用：

- 离线药典（78 条，12 类）、系统学习（111 专题）、诊疗路径（54 条，全部有来源入口）
- 化验解读（155 项词典 + 132 项完整五档参考区间）
- 检查报告术语（67 项 / 15 类）
- 静脉治疗安全（14 项）+ 输液速率数学换算
- 病历书写质控本地规则
- 全真模拟接诊（157 份病例、36 个主场景）
- 循证练习（50 题）
- 医学逐条审校工作台（2916 条台账）

### 2. Windows 双击启动

```
Windows_双击启动_需安装Python.bat
```

需要已安装 Python 3.12+ 与 `requirements.txt` 依赖。

### 3. Docker（含中文 Tesseract）

```bash
docker build -t pediatric-cn-v1.5 .
docker run --rm -p 8000:8000 --env-file .env pediatric-cn-v1.5
```

Dockerfile 会执行 `tools/rebuild_large_assets.py`，从 `asset_parts/` 还原并校验大体积数据文件。
**修改数据后必须重新运行 `python tools/split_large_assets.py` 重建分片**，否则容器会还原成旧数据。

### 4. iPhone / PWA

部署到 HTTPS 地址后，Safari 打开 → 分享 → 添加到主屏幕。
首次访问由 Service Worker 缓存 `web/sw.js` 清单中的全部静态资源（含 `drug_formulary.json`、
`lab_reference_ranges.json`），之后断网仍可使用离线药典、学习库、化验解读、模拟接诊与练习。

## 二、离线内容与在线 API 的分工

| 功能 | 离线（无需 Key） | 在线（需要 Key） |
| --- | --- | --- |
| 查药 | 离线药典检索、分类浏览、详情、收藏 | 天聚数行 / 摩熵数科说明书检索（设备直连） |
| 批文核验 | 国家药监局官网手工核验跳转 | 摩熵中国药品批文库辅助检索 |
| 化验解读 | 词典 + 教学参考区间 + 本地规则解析 | 无（后端可选 OCR 需自建 Tesseract） |
| 模拟接诊 | 全部 157 份病例、36 主场景、评分与导出 | 无 |
| 疑难提问 | 本地知识库检索 | 可选 DeepSeek 直连（需自备 Key 并勾选同意） |
| 病历质控 | 本地规则筛查 | 可选 DeepSeek 二次审阅（需自备 Key） |

**查药逻辑**：未填写说明书 Key 时，搜索框自动走离线药典；填写后走在线接口。
两种结果在列表上都标注来源（“离线教学药典” / 数据源名称），不会混为一谈。

## 三、Key 管理

1. 打开 App「工具 → API 直连设置」。
2. DeepSeek、天聚数行、摩熵数科的 Key 只保存在**当前设备浏览器 localStorage**，不上传本项目服务器。
3. 每个 Key 都可单独清除；使用“清除全部本机 Key”可一次性清空。
4. 服务端模式（`AI_API_KEY` / `APP_ACCESS_CODE` / `OCR_ACCESS_CODE`）写在 `.env`，不要提交到仓库、不要放进 `web/`。
5. 跨域限制：若服务商拒绝浏览器直连，页面会明确提示；本地学习与离线药典不受影响。

## 四、内容更新流程（改数据后照做）

```bash
# 1) 修改 data/*.json 或新增扩充文件
python tools/merge_v15_content.py        # 幂等合并扩充文件（题库/专题/病例脚本/路径补源）
python tools/build_evidence_audit.py     # 重建审校台账（data + docs CSV + docs 统计）
# 2) 同步 web/ 静态副本（PWA 与后端同源）
python - <<'PY'
import shutil
for n in ('medical_audit','quiz_cases','learning','clinical_extension','source_registry',
          'simulation_cases','drug_formulary','lab_reference_ranges'):
    shutil.copyfile(f'data/{n}.json', f'web/{n}.json')
PY
# 3) 重新切分大资产分片（Docker/CI 依赖）
python tools/split_large_assets.py
# 4) 验收
python tools/report_content_coverage.py
python -m pytest -q
for f in web/*.js; do node --check "$f"; done
```

## 五、新接口速查

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/formulary/meta` | 分类、条目数、政策声明 |
| GET | `/api/formulary?q=&category=&page=&page_size=` | 离线药典检索（q 匹配药名/别名/分类/适应证/要点） |
| GET | `/api/formulary/{drug_id}` | 单条详情；不存在返回 404 |
| GET | `/api/labs/reference?code=WBC` | 参考区间；未知 code 返回 404 |
| GET | `/api/sim/scenarios` | 36 个主场景 + 病例总数 |
| GET | `/api/content/stats` | 内容覆盖统计 |
| GET | `/api/quiz` | 题库（等价 `/api/study-quiz`） |
| GET | `/api/status` | 追加 `version` 与 `offline` 计数 |

所有新接口只读本地 JSON，不写库、不缓存、不调用第三方。

## 六、常见问题

**Q：没 Key 为什么还能查药？**
A：查的是离线药典（`data/drug_formulary.json`），为编辑性教学整理，不是厂家说明书原文。

**Q：离线药典的剂量能直接用吗？**
A：不能。所有剂量文字都是教学性范围，必须核对本院制剂说明书、年龄/体重/肝肾功能与最新指南。

**Q：参考区间和报告单不一致？**
A：以报告单为准。教学区间只作对照，且不同仪器、试剂、方法不可通用；新生儿不得套用 28 天以上儿童区间。

**Q：Docker 起来后数据变成旧版？**
A：忘记执行 `python tools/split_large_assets.py`，容器还原了旧分片。

**Q：Service Worker 还显示旧页面？**
A：V1.5 缓存名为 `pediatric-cn-shell-v1.5.0-direct`，会自动清旧缓存；如仍异常，Safari 设置中清除网站数据后重新添加。

**Q：这是不是已经过医学审核？**
A：不是。审校台账 3263 条全部为“待审核”，专家签审数为 0。

## 七、V1.6 补充（结构化升级）

1. 新增两个派生数据文件：`data/dose_rules.json`（110 条药物的结构化教学剂量规则，79 条可计算）、`data/relations.json`（273 个实体 / 706 条双向关联）。**不要手改**，用脚本按顺序重建：
   ```bash
   python tools/merge_v16_content.py      # 1) 合并扩容包（幂等）
   python tools/build_dose_rules_v16.py   # 2) 从药典条目抽取剂量规则
   python tools/build_relations_v16.py    # 3) 重建关联索引
   ```
   顺序不能颠倒：两者都依赖合并后的主数据。
2. 新增 4 个接口：`/api/search/all`、`/api/dose-rules`、`/api/relations`、`/api/content/version`。
3. 新增结构门禁：`python tools/validate_content.py`（6 份 JSON Schema，零第三方依赖）。CI 先跑它再跑 pytest。
4. 前端新增全局检索页、详情页“相关条目”、药典详情“体重→教学区间”面板；Service Worker 缓存升级到 `v1.6.0`。
5. 版本号已对齐：`app/main.py` 1.6.0、页面 V1.6、缓存 v1.6.0、测试断言同步。
6. 边界：剂量规则是**从本项目条目文字抽取**的教学区间，不是说明书数据，`verified=false`；关联与检索都只是名称/字符串匹配，不代表医学结论一致。
