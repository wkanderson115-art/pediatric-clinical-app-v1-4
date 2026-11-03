# 查药数据源备选方案（个人可落地）

目标：**个人开发者/个人账号**也能让 App 查到中文药品资料。
本项目已有的两条：摩熵数科（企业认证 + 商务报价）、天聚数行（个人可注册，内置适配）。
第三条是 V1.7.3 新增的 **自定义 Provider**：任意返回 JSON 的药品接口，用环境变量做字段映射，代码零改动。

## 一、可选数据源对照

| 数据源 | 个人可行性 | 计费/额度 | 语言/覆盖 | 接入方式 |
| --- | --- | --- | --- | --- |
| **天聚数行 药品说明书** | 可注册（手机号），按套餐 | 免费试用额度 + 付费套餐，具体以[官网 VIP 页](https://www.tianapi.com/vip.html)为准 | 中文，说明书摘要 | 已内置：填 `TIANAPI_KEY`，`DRUG_PROVIDER=tianapi` |
| **易源 ShowAPI 药品信息查询（apiCode 1468）** | 可注册，有免费试用 | 按次/套餐，以[接入指南](https://www.showapi.com/guides/drug-info-quickstart-1468)为准 | 中文 | 自定义 Provider（见下） |
| **极速数据 药品说明书** | 可注册 | 套餐制 | 中文 | 自定义 Provider（POST/GET 均可） |
| **极数本源 apizero 药品说明书** | 可注册 | 套餐制 | 中文 | 自定义 Provider |
| **openFDA drug label** | 免费，邮箱即可申请 Key | **无 Key：240 次/分、1000 次/日/IP；有 Key：240 次/分、120000 次/日**（[官方说明](https://open.fda.gov/apis/authentication/)） | 英文，美国标签，字段最全 | 自定义 Provider（已给示例） |
| **CDE 中国上市药品目录集** | 公开下载，无需账号 | 免费 | 中文，目录级（批文/剂型/厂家） | 离线导入（见第三节），不做实时查询 |
| **国家医保药品目录** | 公开文件下载 | 免费 | 中文，甲乙类/限定支付 | 离线导入 |
| **国家药监局数据查询** | 无公开 API，只能人工检索 | 免费 | 中文，官方 | 保留为人工核验入口（App 内已内置跳转） |

说明：以上平台的免费额度、价格与接口字段会变，接入前用 `python tools/check_drug_api.py --raw` 打一次真实请求确认。

## 二、自定义 Provider（个人首选）

任意接口只要满足「给关键词返回 JSON」，就能接：

```bash
# .env
DRUG_PROVIDER=custom
CUSTOM_DRUG_API_URL=https://route.showapi.com/1468-1
CUSTOM_DRUG_API_METHOD=GET
CUSTOM_DRUG_API_EXTRA_QUERY={"showapi_appid":"<appid>","showapi_sign":"<签名>"}
CUSTOM_DRUG_API_QUERY_PARAM=keyword
CUSTOM_DRUG_API_LIST_PATH=showapi_res_body.list
CUSTOM_DRUG_API_FIELD_MAP={"name":"title","content":"content"}
CUSTOM_DRUG_API_SOURCE=易源ShowAPI
CUSTOM_DRUG_API_SOURCE_URL=https://www.showapi.com/
```

```bash
# openFDA 示例（英文，免费）
DRUG_PROVIDER=custom
CUSTOM_DRUG_API_URL=https://api.fda.gov/drug/label.json
CUSTOM_DRUG_API_METHOD=GET
CUSTOM_DRUG_API_KEY=<openFDA key>
CUSTOM_DRUG_API_KEY_PARAM=api_key
CUSTOM_DRUG_API_QUERY_PARAM=search
CUSTOM_DRUG_API_EXTRA_QUERY={"limit":"5"}
CUSTOM_DRUG_API_LIST_PATH=results
CUSTOM_DRUG_API_FIELD_MAP={"name":"openfda.brand_name.0","manufacturer":"openfda.manufacturer_name.0","approval_number":"set_id"}
CUSTOM_DRUG_API_SECTIONS_KEY=
```

字段说明（`app/main.py` 的 `CUSTOM_DRUG`）：

| 变量 | 作用 | 默认 |
| --- | --- | --- |
| `CUSTOM_DRUG_API_URL` | 接口地址（必须 https） | 空（空=不启用） |
| `CUSTOM_DRUG_API_METHOD` | GET / POST | GET |
| `CUSTOM_DRUG_API_BODY_FORMAT` | POST 时 json / form | json |
| `CUSTOM_DRUG_API_KEY` + `_KEY_HEADER` / `_KEY_PARAM` / `_KEY_PREFIX` | Key 放请求头还是查询参数，前缀（如 `Bearer`） | 空 |
| `CUSTOM_DRUG_API_QUERY_PARAM` | 关键词参数名（如 `keyword` / `word` / `search`） | q |
| `CUSTOM_DRUG_API_PAGE_PARAM` | 翻页参数名；留空不分页 | page |
| `CUSTOM_DRUG_API_EXTRA_QUERY` / `_EXTRA_BODY` | 固定附加参数（appid、sign、limit 等），JSON | {} |
| `CUSTOM_DRUG_API_LIST_PATH` | 结果数组的点路径，如 `showapi_res_body.list`、`data`、`results` | data |
| `CUSTOM_DRUG_API_SECTIONS_KEY` | 说明书章节数组的路径；设空则回退取 `content` 字段 | sections |
| `CUSTOM_DRUG_API_SECTION_TITLE` / `_CONTENT` | 章节内标题/正文的键名 | title / content |
| `CUSTOM_DRUG_API_FIELD_MAP` | Drug 字段 → 点路径，JSON：`name/trade_name/dosage_form/specifications/manufacturer/approval_number/revise_date` | {} |
| `CUSTOM_DRUG_API_SOURCE` / `_SOURCE_URL` | 结果显示的来源名与链接 | 自定义药品接口 / 空 |

验证：

```bash
python tools/check_drug_api.py --q 阿莫西林 --raw
uvicorn app.main:app --port 8000
curl -s "http://127.0.0.1:8000/api/status" | jq '{provider,mode,custom_api_configured}'
curl -s "http://127.0.0.1:8000/api/search?q=阿莫西林" | jq '{provider,count,first:.items[0].name}'
```

## 三、免费离线方案（不花一分钱、无额度限制）

1. **CDE 中国上市药品目录集**（[cde.org.cn/hymlj](https://www.cde.org.cn/hymlj/)）：下载目录集 Excel/PDF，转成 JSON 后并入离线药典的 `approval_number` 字段，App 离线可查批文与厂家。
2. **国家医保药品目录**：官方文件下载，整理成 `data/insurance_catalog.json`，用于「是否医保/甲乙类/限定支付」检索。
3. **本项目自带离线药典**：110 条常用药、20 类，已含适应证/剂量原则/禁忌/监测，没 Key 时自动作为兜底。

导入目录集的最小脚本骨架：

```python
import pandas as pd, json
df = pd.read_excel('data/library/raw/上市药品目录集.xlsx', header=2)
rows = [{'name': r['药品名称'], 'dosage_form': r['剂型'], 'approval_number': r['批准文号'],
         'manufacturer': r['生产企业']} for _, r in df.iterrows()]
json.dump({'items': rows}, open('data/approval_catalog.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=2)
```

## 四、路由与开关

```text
DRUG_PROVIDER=auto      → custom（配了就优先） > moseng > tianapi > 离线药典
DRUG_PROVIDER=custom    → 只用自定义接口
DRUG_PROVIDER=tianapi   → 只用天聚数行
DRUG_PROVIDER=moseng    → 只用摩熵
```
注意：自定义 Provider 只映射**说明书检索**；`/api/approvals`（批文库）仍需要摩熵权限，没有就退回国家药监局人工核验入口。

## 五、工程建议（避免额度被打爆）

1. 反代层给 `/api/search` 加 60s 缓存与每 IP 限流（服务端已 `Cache-Control: no-store`，缓存放代理层）。
2. 客户端做 300ms 防抖（App 内查药输入已做）。
3. 失败/超限自动回退离线药典（V1.7.1 起已实现：`provider=null` 时查药走 110 条离线条目）。
4. 不要把第三方 Key 写进前端直连模式共用设备；直连模式只适合个人自用手机。

## 六、验收标准

```bash
python tools/check_drug_api.py --q 阿莫西林          # 退出码 0 且打印 1 条以上
curl -s "http://127.0.0.1:8000/api/status" | jq .provider   # 返回 custom/tianapi 之一
curl -s "http://127.0.0.1:8000/api/search?q=阿莫西林" | jq '.items[0].sections|length'  # ≥1
```
