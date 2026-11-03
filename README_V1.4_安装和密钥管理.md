# 儿科临床药典 V1.4：DeepSeek V4.1 Flash 与 iPhone API 密钥管理

## 本次变更

基于 V1.3 保留原有儿科模拟接诊、156+虚构教学病例、药品查询、病历质控、报告OCR、学习记录，增加：

1. **固定使用官方 DeepSeek V4.1 Flash**。官方 API 请求的 `model` 为 `deepseek-flash`（截至2026年10月29日对应官方 V4.1 Flash-1017）。并非无效模型名 `deepseek-4.1-flash`。
2. 新增 **工具 → API 密钥管理**。支持 DeepSeek、天聚数行、摩熵数科，管理员登录后保存、清除、状态查询、实际联网检测。
3. 不向前端返回已有 API Key；不写入 Safari localStorage/sessionStorage；管理员凭证只由服务器验证。密钥文件使用 Fernet 验证加密（cryptography），主密钥只在环境变量中。关闭管理页面不改变已存储密钥。
4. 管理员会话采用 30 分钟有效期、HttpOnly/Secure/SameSite=Strict cookie，并要求 CSRF 验证；错误密码5次/15分钟临时封锁（**仅适用于单进程**）。
5. 禁止用户输入任意 AI API URL：本版只会向 `https://api.deepseek.com/chat/completions` 发送你配置的 DeepSeek 密钥。

### 重要边界

- **App需要一台你控制的后端服务器**。单靠把 ZIP 解压到 iPhone，不会出现在线管理中心；应用必须在 HTTPS 网站部署并打开。需自己持有相应 DeepSeek/中文说明书服务商的合法 API Key。
- 密钥存在服务器加密文件，并不是手机离线保存。为保证服务器重启仍有效，必须持久化 `/srv/private` 并妥善保存 `APP_SECRET_ENCRYPTION_KEY`。**丢失加密主密钥将无法恢复保存的 API Key。**
- 密钥显示“已配置”并不等于在线可用；点击“测试连接”会产生实际网络请求、可能产生服务商调用费用，也会受到你所购买套餐权限限制。
- 管理中心不能代替数据供应商授权。摩熵“说明书”与“批文”可能需要独立购买权限。国家药监局仍为网页核验入口，不存在已接通的官方直连 API。
- 本项目用于儿科临床学习，所有诊疗、剂量、模拟处置仍须医学专家审核，不能用于真实病人处方或正式病历审批。不要把真实患者数据发送给第三方 AI。

## 一、准备服务器

必须装 Python 3.12+ 或 Docker，开启 HTTPS。安装依赖：

```bash
python -m pip install -r requirements.txt
```

生成加密主密钥：

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

设置服务器环境变量，不要将真实值提交到 GitHub：

```dotenv
ADMIN_PASSWORD=这里填自己生成的至少16字符随机管理员密码
APP_SECRET_ENCRYPTION_KEY=这里填上面生成的Fernet字符串
APP_SECRET_FILE=/srv/private/secrets.enc
FORWARDED_ALLOW_IPS=127.0.0.1
APP_ACCESS_CODE=另设一个至少8位的AI问答访问码
DRUG_PROVIDER=auto
```

上述内容仅为示范，`.env.example` 是模板，不含真实凭证。你的部署平台需要实际加载环境变量（例如 Docker Compose `env_file: .env`），Python代码不会自动读取 `.env` 文件。**不要把 `APP_SECRET_FILE=/srv/private/secrets.enc` 复制到普通 Windows 本机运行环境**，本机运行时可以不设置该变量，默认保存到项目的 `private/secrets.enc`。

若由 Nginx、Caddy 或云负载均衡器提供 HTTPS，`FORWARDED_ALLOW_IPS` 必须设为该反向代理连接到容器时使用的 IP 或 CIDR。容器只信任此列表中的 `X-Forwarded-Proto`，管理员登录才会正确识别 HTTPS。不要设置为不受你控制的公网地址。

## 二、Docker Compose 自托管样例

项目提供 `docker-compose.yml`。先在项目根目录创建 `.env`，填入强密码和加密主密钥，然后：

```bash
docker compose up -d --build
```

Compose 仅绑定 `127.0.0.1:8000`，**不要直接以公网HTTP开放8000端口**。需要另外配置 Caddy/Nginx 等 HTTPS 反向代理，转发到内部8000端口，并确保 Uvicorn 识别来自可信代理的 HTTPS scheme；否则管理员页面将拒绝非 HTTPS 登录。部署在云平台时使用平台提供的受信任 HTTPS 代理与持久化卷。

从旧 V1.3 升级时保留此前的 `APP_ACCESS_CODE` 以维持手机端 AI 问答功能。API Key 可先从环境变量读取；通过管理员页面保存新的 Key 后，安全密钥库中的值优先。删除则会显式禁用该服务，防止旧环境变量意外重新生效。

## 三、iPhone 操作步骤

1. 在 iPhone Safari 打开部署完成的 **HTTPS** 应用网址。
2. 进入 **工具 → 🔐 API 密钥管理**。
3. 输入你自己在服务器设置的 `ADMIN_PASSWORD`，登录。
4. 在 **DeepSeek V4.1 Flash** 处粘贴 DeepSeek API Key，点击“加密保存”。
5. 可点击“测试连接”：若成功，会显示一次真实 `deepseek-flash` API 调用成功。不会回显 Key。
6. 同样可以配置天聚数行或摩熵数科药品说明书 Key，然后分别点击测试。
7. 点击“退出管理员”。实际 AI 病历审阅或问答仍需开启外部数据发送同意，使用另外设置的 `APP_ACCESS_CODE`。

## 四、安全与运维要点

- 公网使用必须 HTTPS；用长随机管理员密码并限制管理员访问来源/IP。单机进程内登录限流仅是基础防护，不足以代替专业网关限流、监控与访问审计。
- `APP_SECRET_ENCRYPTION_KEY` 不要保存在 App 或公开源码。加密文件和主密钥要分别备份，并设置最小权限。
- 无需把 API Key 发给 ChatGPT 或上传到聊天；请自己在私有部署页面填写。
- 若换加密主密钥，请先用原主密钥正确解密并安全迁移文件，不能直接换值。
- API 管理没有接收任何真实患者信息的必要；使用模拟数据测试。
- 管理中心是单管理员自托管实现，不是医院级 IAM（无审计日志、双因素认证、集群 session 存储、密钥云托管）；如面向多人部署，应接入成熟身份供应商、密钥托管和集中审计。

## 五、实测范围

已通过70项后端/数据自动化测试，另用390px iPhone 尺寸的离线模拟页面测试了管理员登录、状态更新、保存动作和页面异常。**未取得你自己的 API Key，所以 DeepSeek、天聚数行和摩熵的真实网络连接未验收。真实 iPhone Safari/HTTPS 服务部署尚未完成。**

模型来源：
- https://api-docs.deepseek.com/zh-cn/updates/
- https://api-docs.deepseek.com/zh-cn/news/news260910/
- https://api-docs.deepseek.com/
