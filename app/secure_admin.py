"""Self-hosted one-admin encrypted API credential management.

Key bytes never reach a GET response or browser storage. ADMIN_PASSWORD and
APP_SECRET_ENCRYPTION_KEY must be provisioned outside the application.
"""
import json
import os
import secrets
import time
from pathlib import Path
from threading import RLock

import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, Field

router = APIRouter(prefix='/api/admin', tags=['administrator'])
ALLOWED_KEYS = ('AI_API_KEY', 'TIANAPI_KEY', 'MOSENG_API_KEY')
MODEL = 'deepseek-flash'  # Official alias for DeepSeek-V4.1-Flash-1017
_sessions = {}
_failed = {}
_last_checks = {}
_lock = RLock()
COOKIE = 'peds_admin_session'
SESSION_SECONDS = 1800


def _secret_path():
    # Mount this parent as a persistent, private directory in production.
    return Path(os.environ.get('APP_SECRET_FILE', str(Path(__file__).resolve().parent.parent / 'private' / 'secrets.enc')))


def _fernet():
    key = os.environ.get('APP_SECRET_ENCRYPTION_KEY', '')
    if not key:
        raise HTTPException(503, '管理员加密主密钥未配置。')
    try:
        return Fernet(key.encode('ascii'))
    except (ValueError, TypeError):
        raise HTTPException(503, '管理员加密主密钥格式无效。')


def _read_all():
    path = _secret_path()
    if not path.exists():
        return {}
    try:
        plaintext = _fernet().decrypt(path.read_bytes())
        data = json.loads(plaintext)
        if not isinstance(data, dict) or not all(k in ALLOWED_KEYS for k in data):
            raise ValueError('Invalid credential schema')
        return data
    except (InvalidToken, ValueError, OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise HTTPException(503, '密钥库无法解密或数据损坏；请检查加密主密钥和备份。') from exc


def _write_all(obj):
    path = _secret_path()
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    ciphertext = _fernet().encrypt(json.dumps(obj, ensure_ascii=False).encode('utf-8'))
    tmp = path.with_name(path.name + '.' + secrets.token_hex(5) + '.tmp')
    try:
        fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'wb') as f:
            f.write(ciphertext)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
        os.chmod(path, 0o600)
    finally:
        if tmp.exists():
            tmp.unlink()


def get_value(name: str, default: str = ''):
    """Existing environment keys remain supported until overwritten in admin UI."""
    if name == 'AI_MODEL':
        return MODEL
    if name in ALLOWED_KEYS:
        with _lock:
            stored = _read_all() if _secret_path().exists() else {}
        if name in stored:
            return stored[name]
    return os.environ.get(name, default)


def _enabled():
    pwd = os.environ.get('ADMIN_PASSWORD', '')
    return len(pwd) >= 16 and bool(os.environ.get('APP_SECRET_ENCRYPTION_KEY'))


def _require_https(request: Request):
    # Proxies must be configured to expose HTTPS through uvicorn proxy headers.
    # Strictly require HTTPS, except local loopback development.
    host = (request.url.hostname or '').lower()
    if request.url.scheme != 'https' and host not in {'localhost', '127.0.0.1', 'testserver'}:
        raise HTTPException(403, '管理后台只允许HTTPS访问。')


def _origin_ok(request: Request):
    origin = request.headers.get('origin')
    if origin:
        from urllib.parse import urlsplit
        try:
            parts = urlsplit(origin)
            expected = urlsplit(str(request.base_url))
            if (parts.scheme, parts.netloc) != (expected.scheme, expected.netloc):
                raise HTTPException(403, '请求来源不匹配。')
        except ValueError:
            raise HTTPException(403, '请求来源不匹配。')


def _require_session(request: Request, mutation=False):
    _require_https(request)
    _origin_ok(request)
    token = request.cookies.get(COOKIE, '')
    now = time.monotonic()
    with _lock:
        item = _sessions.get(token) if token else None
        if not item or item['expires'] < now:
            if token: _sessions.pop(token, None)
            raise HTTPException(401, '请先登录管理员。')
        if mutation and not secrets.compare_digest(request.headers.get('X-Admin-CSRF', ''), item['csrf']):
            raise HTTPException(403, '管理操作验证失败。')
        item['expires'] = now + SESSION_SECONDS
        return item


class LoginPayload(BaseModel):
    password: str = Field(min_length=1, max_length=512)


class KeyPayload(BaseModel):
    service: str
    api_key: str = Field(min_length=6, max_length=1024)


class CheckPayload(BaseModel):
    service: str


@router.get('/availability')
async def availability():
    return {'admin_enabled': _enabled(), 'model': MODEL, 'model_label': 'DeepSeek V4.1 Flash',
            'requires_https': True, 'login_required': True}


@router.post('/login')
async def login(payload: LoginPayload, request: Request, response: Response):
    _require_https(request)
    _origin_ok(request)
    if not _enabled():
        raise HTTPException(503, '需要先在服务器配置管理员口令和加密主密钥。')
    ip = request.client.host if request.client else 'unknown'
    now = time.monotonic()
    with _lock:
        block = [t for t in _failed.get(ip, []) if t > now - 900]
        _failed[ip] = block
        if len(block) >= 5:
            raise HTTPException(429, '登录失败次数过多，请15分钟后再试。')
    correct = secrets.compare_digest(payload.password.encode(), os.environ['ADMIN_PASSWORD'].encode())
    if not correct:
        with _lock: _failed.setdefault(ip, []).append(now)
        raise HTTPException(401, '管理员密码不正确。')
    with _lock:
        _failed.pop(ip, None)
        token, csrf = secrets.token_urlsafe(40), secrets.token_urlsafe(32)
        _sessions[token] = {'csrf': csrf, 'expires': now + SESSION_SECONDS}
        if len(_sessions) > 200:  # Reap stale sessions
            for key, session in list(_sessions.items()):
                if session['expires'] < now: _sessions.pop(key, None)
    response.set_cookie(COOKIE, token, max_age=SESSION_SECONDS,
                        httponly=True, secure=True, samesite='strict', path='/api/admin')
    return {'authenticated': True, 'csrf': csrf, 'model': MODEL}


@router.get('/session')
async def session(request: Request):
    item = _require_session(request)
    with _lock:
        stored = _read_all() if _secret_path().exists() else {}
    return {'authenticated': True, 'csrf': item['csrf'], 'model': MODEL,
            'services': {name: {'configured': bool(get_value(name)),
                                'source': 'encrypted-server' if name in stored else 'environment' if os.environ.get(name) else 'none'}
                         for name in ALLOWED_KEYS},
            'note': '不会返回任何API Key内容；configured只表示已配置，不能证明远端接口有效。'}


@router.post('/logout')
async def logout(request: Request, response: Response):
    _require_session(request, mutation=True)
    token = request.cookies.get(COOKIE)
    with _lock: _sessions.pop(token, None)
    response.delete_cookie(COOKIE, path='/api/admin', secure=True, httponly=True, samesite='strict')
    return {'ok': True}


@router.put('/key')
async def save_key(payload: KeyPayload, request: Request):
    _require_session(request, mutation=True)
    if payload.service not in ALLOWED_KEYS:
        raise HTTPException(422, '不允许的接口名称。')
    api_key = payload.api_key.strip()
    if len(api_key) < 6 or '\n' in api_key or '\r' in api_key:
        raise HTTPException(422, 'API Key格式无效。')
    with _lock:
        obj = _read_all()
        obj[payload.service] = api_key
        _write_all(obj)
    return {'saved': True, 'service': payload.service, 'configured': True}


@router.delete('/key/{service}')
async def delete_key(service: str, request: Request):
    _require_session(request, mutation=True)
    if service not in ALLOWED_KEYS:
        raise HTTPException(422, '不允许的接口名称。')
    with _lock:
        obj = _read_all()
        # Explicit empty override: do not resurrect environment secret silently.
        obj[service] = ''
        _write_all(obj)
    return {'deleted': True, 'service': service, 'configured': False}


@router.post('/test')
async def test_connection(payload: CheckPayload, request: Request):
    _require_session(request, mutation=True)
    service = payload.service
    if service not in ALLOWED_KEYS:
        raise HTTPException(422, '无效的服务名称。')
    key = get_value(service)
    if not key:
        raise HTTPException(503, '尚未保存此接口的密钥。')
    now = time.monotonic()
    with _lock:
        last = _last_checks.get(service)
        if last is not None and now - last < 30:
            raise HTTPException(429, '30秒内最多检测一次。')
        _last_checks[service] = now
    try:
        async with httpx.AsyncClient(timeout=18, follow_redirects=False) as client:
            if service == 'AI_API_KEY':
                response = await client.post('https://api.deepseek.com/chat/completions',
                    headers={'Authorization':'Bearer '+key},
                    json={'model': MODEL, 'messages':[{'role':'user','content':'请仅回答：OK'}], 'max_tokens':8})
                valid = response.status_code == 200 and bool(response.json().get('choices'))
            elif service == 'TIANAPI_KEY':
                response = await client.post('https://apis.tianapi.com/yaopin/index',
                    data={'key':key,'word':'阿奇霉素','page':'1','num':'1'})
                valid = response.status_code == 200 and response.json().get('code') == 200
            else:
                response = await client.post('https://srv-openapi.bcpmdata.com/pharma/general/v1/drug_instruction/list',
                    headers={'Authorization':key,'Content-Type':'application/json'},
                    json={'search':{'drug_name':'阿奇霉素'},'page':1})
                valid = response.status_code == 200 and response.json().get('code') == 10200
        if not valid:
            return {'ok': False, 'service': service,
                    'message': '未通过接口验证；请检查密钥、权限或查询配额。'}
        return {'ok': True, 'service': service, 'model': MODEL if service == 'AI_API_KEY' else None,
                'message': '测试请求成功；不保证后续可用或覆盖全部药品。'}
    except (httpx.HTTPError, ValueError, TypeError):
        return {'ok': False, 'service': service, 'message': '连接失败或响应异常；未记录远端响应正文。'}
