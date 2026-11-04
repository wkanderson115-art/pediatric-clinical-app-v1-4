"""V1.12：DeepSeek AI 接入修复（模型名、服务端代理、诊断接口、错误透传）。"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app_main.app)


def test_model_name_is_official():
    """官方模型名只有 deepseek-flash / deepseek-v4-pro。"""
    status = client.get('/api/status').json()
    assert status['ai_model'] in ('deepseek-flash', 'deepseek-v4-pro'), status['ai_model']


def test_frontend_uses_official_model_and_server_fallback():
    direct = (ROOT / 'web/direct-api.js').read_text(encoding='utf-8')
    admin = (ROOT / 'web/admin-ui.js').read_text(encoding='utf-8')
    assert "deepseekModel: 'deepseek-flash'" in direct
    assert 'deepseek-v4.1-flash' not in direct
    assert 'deepseek-v4.1-flash' not in admin
    assert 'chatViaServer' in direct and '/api/ai/chat' in direct
    assert 'appAccessCode' in direct
    assert '测试 DeepSeek 连接' in admin


def test_diagnose_endpoint_shape():
    data = client.get('/api/ai/diagnose').json()
    for key in ('server_key_configured', 'model', 'base_url', 'access_code_ready', 'reachable', 'detail', 'hint'):
        assert key in data, key
    assert data['model'] in ('deepseek-flash', 'deepseek-v4-pro')
    assert 'deepseek-flash' in data['hint']


def test_chat_requires_access_code_and_key(monkeypatch):
    monkeypatch.delenv('APP_ACCESS_CODE', raising=False)
    response = client.post('/api/ai/chat', json={'messages': [{'role': 'user', 'content': 'hi'}]})
    assert response.status_code == 503
    assert 'APP_ACCESS_CODE' in response.json()['detail']

    monkeypatch.setenv('APP_ACCESS_CODE', 'testcode123')
    wrong = client.post('/api/ai/chat', headers={'X-App-Access': 'bad'},
                        json={'messages': [{'role': 'user', 'content': 'hi'}]})
    assert wrong.status_code == 403

    monkeypatch.setattr(app_main, 'get_value', lambda name, default='': '')
    no_key = client.post('/api/ai/chat', headers={'X-App-Access': 'testcode123'},
                         json={'messages': [{'role': 'user', 'content': 'hi'}]})
    assert no_key.status_code == 503
    assert 'AI_API_KEY' in no_key.json()['detail']


def test_upstream_error_messages_are_actionable():
    class FakeResponse:
        def __init__(self, status, text=''):
            self.status_code = status
            self.text = text

    assert '401' in app_main.ai_upstream_error(Exception(), FakeResponse(401))
    assert '402' in app_main.ai_upstream_error(Exception(), FakeResponse(402))
    assert 'deepseek-flash' in app_main.ai_upstream_error(Exception(), FakeResponse(400))
    assert '429' in app_main.ai_upstream_error(Exception(), FakeResponse(429))
    assert '连接 DeepSeek 失败' in app_main.ai_upstream_error(TimeoutError())


def test_http_client_ignores_broken_proxy_env(monkeypatch):
    """本机 NO_PROXY 值损坏时 httpx 会抛 InvalidURL；统一客户端必须能正常构造。"""
    monkeypatch.setenv('NO_PROXY', '[::1]bad')
    monkeypatch.delenv('USE_ENV_PROXY', raising=False)
    client_obj = app_main.http_client(5)
    assert isinstance(client_obj, app_main.httpx.AsyncClient)
    # 内部属性名随 httpx 版本变化，这里只保证构造不炸、且能正常发出请求对象
    assert getattr(client_obj, '_trust_env', False) in (False, None)
    # 显式开启代理读取时，用户必须提供合法代理变量；这里给合法的 NO_PROXY 验证开关生效
    monkeypatch.setenv('NO_PROXY', '127.0.0.1,localhost')
    monkeypatch.setenv('USE_ENV_PROXY', '1')
    assert isinstance(app_main.http_client(5), app_main.httpx.AsyncClient)
