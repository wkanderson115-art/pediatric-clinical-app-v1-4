from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).resolve().parents[1] / 'web'
h=(root/'index.html').read_text()
h=re.sub(r'<script[^>]+src=[^>]+></script>','',h)
h=re.sub(r'<link[^>]+href=[^>]+>','',h)
js=(root/'admin-ui.js').read_text()
css=(root/'style.css').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(h,wait_until='domcontentloaded')
 page.add_style_tag(content=css)
 page.evaluate('''() => {
   const state={AI_API_KEY:{configured:false,source:'none'},TIANAPI_KEY:{configured:false,source:'none'},MOSENG_API_KEY:{configured:false,source:'none'}};
   let logged=false;
   window.fetch=async (url,options={})=>{
    const path=String(url).replace('/api/admin/','');let result;
    if(path==='availability') result={admin_enabled:true,model:'deepseek-flash'};
    else if(path==='login') {logged=true;result={csrf:'test-csrf',authenticated:true}}
    else if(!logged) return {ok:false,json:async()=>({detail:'请先登录'})};
    else if(path==='session') result={csrf:'test-csrf',authenticated:true,services:state};
    else if(path==='key' && options.method==='PUT'){const body=JSON.parse(options.body);state[body.service]={configured:true,source:'encrypted-server'};result={saved:true}}
    else if(path==='test'){result={ok:true,message:'测试成功'}}
    else if(path==='logout'){logged=false;result={ok:true}}
    else result={ok:true};
    return {ok:true,json:async()=>result};
   };
 }''')
 page.add_script_tag(content=js)
 page.evaluate("document.querySelector('#page-admin').classList.add('active')")
 page.locator('[data-page="admin"]').first.dispatch_event('click')
 page.wait_for_function("!document.querySelector('#admin-login').classList.contains('hidden')")
 page.locator('#admin-password').fill('VeryLongExampleAdminPassword')
 page.locator('#admin-login button[type=submit]').click()
 page.wait_for_function("!document.querySelector('#admin-panel').classList.contains('hidden')")
 assert page.locator('.admin-service').count()==3
 assert page.get_by_text('deepseek-flash').count()>0
 page.locator('.admin-service').first.locator('input').fill('sk-fake-test-value')
 page.locator('.admin-service').first.get_by_role('button',name='加密保存').click()
 page.wait_for_function("document.querySelector('.admin-service input').value === ''")
 assert '已配置' in page.locator('.admin-service').first.locator('.admin-state').inner_text()
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
 page.screenshot(path='/mnt/data/pediatric_api_admin_v14_preview.png',full_page=False)
 assert not errors,errors
 print('PASS 390px mocked admin UI navigation, login, save, masked status, no overflow, no JS exceptions')
 b.close()
