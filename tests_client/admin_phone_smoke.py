"""Dev-only iPhone viewport exercise. Uses fake keys, no paid calls."""
import os
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.request import urlopen
from playwright.sync_api import sync_playwright
from cryptography.fernet import Fernet

root=Path(__file__).resolve().parents[1]
env=os.environ.copy()
env.update({'ADMIN_PASSWORD':'Strong-Admin-Password-For-UI-Test!',
           'APP_SECRET_ENCRYPTION_KEY':Fernet.generate_key().decode(),
           'APP_SECRET_FILE':str(Path(tempfile.mkdtemp())/'private'/'keys.enc'),
           'APP_ACCESS_CODE':'UI-test-app-access-code'})
server=subprocess.Popen(['python','-m','uvicorn','app.main:app','--host','127.0.0.1','--port','18874'],cwd=root,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
try:
    for i in range(100):
        try:
            urlopen('http://127.0.0.1:18874/api/admin/availability',timeout=1)
            break
        except Exception:time.sleep(.15)
    else:raise RuntimeError('Server not listening')
    with sync_playwright() as p:
        b=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2)
        errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://localhost:18874/',wait_until='domcontentloaded')
        page.get_by_role('button',name='工具',exact=True).click()
        page.get_by_role('button',name='API 密钥管理').click()
        page.wait_for_timeout(250)
        assert page.locator('#page-admin').is_visible()
        page.locator('#admin-password').fill('Strong-Admin-Password-For-UI-Test!')
        page.locator('#admin-login button[type=submit]').click()
        page.wait_for_timeout(500)
        if not page.locator('#admin-panel').is_visible():
            print('Login UI message:', page.locator('#admin-feedback').inner_text())
            raise RuntimeError('Login UI not available; check cookie handling on localhost')
        assert page.get_by_text('deepseek-flash').count()>=1
        panel=page.locator('.admin-service').first
        panel.locator('input').fill('sk-fake-not-a-real-api-key')
        panel.get_by_role('button',name='加密保存').click()
        page.wait_for_timeout(600)
        assert page.locator('.admin-service').first.get_by_text('已配置').count()>=1
        assert panel.locator('input').input_value()==''
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")
        page.screenshot(path='/mnt/data/pediatric_api_admin_v14_preview.png',full_page=False)
        assert not errors,errors
        print('UI PASS: login, save, masked key, 390px, no JS error')
        b.close()
finally:
    server.terminate()
    try:server.communicate(timeout=3)
    except subprocess.TimeoutExpired:server.kill()
