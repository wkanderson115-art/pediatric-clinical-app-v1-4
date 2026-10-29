'use strict';
(() => {
  const el = id => document.getElementById(id);
  const SERVICES = [
    ['AI_API_KEY','DeepSeek V4.1 Flash','AI 疑难问答与病历质控'],
    ['TIANAPI_KEY','天聚数行','中国药品资料查询'],
    ['MOSENG_API_KEY','摩熵数科','中国说明书及批文索引（需分别授权）']
  ];
  let csrf = '';
  const show = (id, value) => el(id).classList.toggle('hidden', !value);
  function feedback(message, error=false){
    const node=el('admin-feedback'); node.textContent=message;
    node.classList.remove('hidden'); node.style.borderColor=error?'#b44':'';
  }
  async function request(path, method='GET', body, sensitive=false){
    const opt={method, credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json'}};
    if(body!==undefined){ opt.headers['Content-Type']='application/json';opt.body=JSON.stringify(body); }
    if(sensitive) opt.headers['X-Admin-CSRF']=csrf;
    let res;
    try{res=await fetch('/api/admin/'+path,opt)}catch{throw new Error('无法连接服务器，请检查HTTPS地址。')}
    const data=await res.json().catch(()=>({detail:'服务器未返回有效数据'}));
    if(!res.ok)throw new Error(typeof data.detail==='string'?data.detail:'操作未成功');
    return data;
  }
  function render(services){
    const root=el('admin-service-list');root.replaceChildren();
    for(const [code,name,description] of SERVICES){
      const item=services[code]||{configured:false,source:'none'};
      const section=document.createElement('section');section.className='clinic-panel admin-service';
      const head=document.createElement('h2');head.textContent=name;
      const hint=document.createElement('p');hint.className='subtext';hint.textContent=description;
      const state=document.createElement('p');state.className='admin-state';
      state.textContent=(item.configured?'● 已配置':'○ 未配置')+'（'+(item.source==='encrypted-server'?'服务器加密保存':item.source==='environment'?'服务器环境变量':'无')+'，未验证实时可用）';
      const label=document.createElement('label');label.textContent='设置新的 API Key（不会显示已保存密钥）';
      const input=document.createElement('input');input.type='password';input.autocomplete='new-password';input.placeholder='在此粘贴新 Key，保存后输入框会清空';input.maxLength=1024;
      const group=document.createElement('div');group.className='chart-actions';
      const save=document.createElement('button');save.type='button';save.textContent='加密保存';save.className='primary-button';
      const test=document.createElement('button');test.type='button';test.textContent='测试连接';test.className='outline-button';test.disabled=!item.configured;
      const clear=document.createElement('button');clear.type='button';clear.textContent='删除密钥';clear.className='outline-button';clear.disabled=!item.configured;
      const busy=async fn=>{for(const b of [save,test,clear])b.disabled=true;try{await fn()}catch(e){feedback(e.message,true)}finally{await refresh().catch(()=>{})}};
      save.addEventListener('click',()=>busy(async()=>{
        if(input.value.trim().length<6){feedback('请输入有效密钥。',true);return}
        await request('key','PUT',{service:code,api_key:input.value},true);
        input.value='';feedback(name+'：密钥已加密保存。请点击测试连接确认权限。');
      }));
      test.addEventListener('click',()=>busy(async()=>{
        feedback(name+'：正在执行一次实际API调用（可能产生少量费用）…');
        const data=await request('test','POST',{service:code},true);
        feedback(name+'：'+data.message,!data.ok);
      }));
      clear.addEventListener('click',()=>busy(async()=>{
        if(!confirm('确认删除'+name+'密钥？此操作将禁用对应在线服务。'))return;
        await request('key/'+encodeURIComponent(code),'DELETE',undefined,true);
        input.value='';feedback(name+'：服务端密钥已清除。');
      }));
      group.append(save,test,clear);section.append(head,hint,state,label,input,group);root.append(section);
    }
  }
  async function refresh(){
    const data=await request('session');csrf=data.csrf||'';
    show('admin-login',false);show('admin-panel',true);render(data.services);
    el('admin-available').textContent='● 管理员已登录 · 默认模型：deepseek-flash';
  }
  async function init(){
    try{
      const availability=await request('availability');
      if(!availability.admin_enabled){
        el('admin-available').textContent='○ 管理中心尚未启用：需在服务器设置 ADMIN_PASSWORD 与 APP_SECRET_ENCRYPTION_KEY。';
        show('admin-login',false);show('admin-panel',false);return;
      }
      el('admin-available').textContent='● 管理功能已启用 · 需要管理员登录';
      try{await refresh()}catch{show('admin-login',true);show('admin-panel',false)}
    }catch(e){el('admin-available').textContent=e.message;show('admin-login',false)}
  }
  el('admin-login').addEventListener('submit',async event=>{
    event.preventDefault();const password=el('admin-password').value;
    try{
      const result=await request('login','POST',{password});
      el('admin-password').value='';csrf=result.csrf;await refresh();feedback('管理员登录成功。密钥始终留在服务器，不会回显。');
    }catch(e){el('admin-password').value='';feedback(e.message,true)}
  });
  el('admin-refresh').addEventListener('click',()=>refresh().catch(e=>feedback(e.message,true)));
  el('admin-logout').addEventListener('click',async()=>{
    try{await request('logout','POST',undefined,true);csrf='';show('admin-panel',false);show('admin-login',true);feedback('已退出管理员。')}catch(e){feedback(e.message,true)}
  });
  // Render only when administrator navigates; do not send secrets to localStorage.
  document.querySelectorAll('[data-page="admin"]').forEach(button=>button.addEventListener('click',init));
})();
