'use strict';
/* API settings are device-local in direct mode. They are never embedded in
 * the bundle or posted to this application's server. */
(() => {
  const el=id=>document.getElementById(id);
  const SERVICES=[
    ['deepseekKey','DeepSeek API Key','用于 AI 学习问答和病历辅助质控。默认模型为 deepseek-v4.1-flash。'],
    ['tianapiKey','天聚数行 API Key','用于药品资料检索。'],
    ['mosengKey','摩熵数科 API Key','用于说明书与批准文号检索；优先于天聚数行。']
  ];
  const feedback=(message,error=false)=>{
    const node=el('admin-feedback'); if(!node)return;
    node.textContent=message; node.classList.remove('hidden');
    node.style.borderColor=error?'#b44':'';
  };
  function render(){
    if(!window.DirectAPI)return;
    const cfg=DirectAPI.read(), root=el('admin-service-list');
    root.replaceChildren();
    const model=document.createElement('section'); model.className='clinic-panel admin-service';
    model.append(Object.assign(document.createElement('h2'),{textContent:'DeepSeek 模型'}));
    const hint=document.createElement('p');hint.className='subtext';hint.textContent='模型名称会随请求发送，但不会代替或暴露 API Key。';model.append(hint);
    const baseLabel=document.createElement('label');baseLabel.textContent='OpenAI 兼容 API 地址';
    const baseInput=document.createElement('input');baseInput.value=cfg.deepseekBaseUrl||'https://api.deepseek.com';baseInput.maxLength=240;baseInput.autocomplete='url';baseInput.placeholder='https://api.deepseek.com';baseLabel.append(baseInput);
    const label=document.createElement('label');label.textContent='看图/建议模型 ID';
    const input=document.createElement('input');input.value=cfg.model||'deepseek-v4.1-flash';input.maxLength=120;input.autocomplete='off';label.append(input);
    const save=document.createElement('button');save.type='button';save.className='primary-button';save.textContent='保存模型设置';save.onclick=()=>{DirectAPI.save({deepseekBaseUrl:baseInput.value.trim().replace(/\/+$/,'')||'https://api.deepseek.com',model:input.value.trim()||'deepseek-v4.1-flash'});feedback('模型设置已保存在当前设备。');};
    model.append(baseLabel,label,save);root.append(model);
    for(const [key,name,description] of SERVICES){
      const section=document.createElement('section');section.className='clinic-panel admin-service';
      const heading=document.createElement('h2');heading.textContent=name;
      const hint=document.createElement('p');hint.className='subtext';hint.textContent=description;
      const state=document.createElement('p');state.className='admin-state';state.textContent=cfg[key]?'● 已保存在此设备':'○ 尚未填写';
      const label=document.createElement('label');label.textContent='API Key（仅保存在此浏览器设备）';
      const field=document.createElement('input');field.type='password';field.autocomplete='new-password';field.maxLength=1024;field.placeholder=cfg[key]?'已保存；填写新值可替换':'在此粘贴 Key';label.append(field);
      const actions=document.createElement('div');actions.className='chart-actions';
      const save=document.createElement('button');save.type='button';save.className='primary-button';save.textContent='保存到此设备';
      save.onclick=()=>{if(field.value.trim().length<6){feedback('请输入有效的 API Key。',true);return;}DirectAPI.save({[key]:field.value.trim()});field.value='';render();feedback(name+' 已保存在当前设备。');};
      const clear=document.createElement('button');clear.type='button';clear.className='outline-button';clear.textContent='删除此 Key';clear.disabled=!cfg[key];
      clear.onclick=()=>{if(confirm('删除此设备保存的 '+name+'？')){DirectAPI.clear(key);render();feedback(name+' 已删除。');}};
      actions.append(save,clear);section.append(heading,hint,state,label,actions);root.append(section);
    }
  }
  function init(){
    el('admin-available').textContent='● API 直连模式 · Key 只保存于当前浏览器设备，不会上传到本项目服务器。';
    el('admin-panel')?.classList.remove('hidden'); render();
  }
  el('admin-refresh')?.addEventListener('click',init);
  el('admin-logout')?.addEventListener('click',()=>{
    if(!confirm('删除本设备保存的全部 API Key？'))return;
    ['deepseekKey','tianapiKey','mosengKey'].forEach(DirectAPI.clear);init();feedback('已删除本设备保存的全部 Key。');
  });
  document.querySelectorAll('[data-page="admin"]').forEach(button=>button.addEventListener('click',init));
  if(document.querySelector('.page.active')?.id==='page-admin')init();
})();
