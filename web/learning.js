'use strict';
/* V0.3: 17 systems/89 topics, anonymous question practice and browser-local journal.
 * Zero patient content is sent outside the device unless the user explicitly selects AI + consents.
 */
const learningState = {systems:[], selected:'all', opened:null, source:'', notesReady:false};
const NOTE_DB_NAME = 'pediatric_cn_learning_journal_v1';
const NOTE_STORE = 'notes';
const KEY_LABELS = {'临床识别':'临床识别','检查与鉴别':'检查与鉴别','处理与用药原则':'处理与用药原则','紧急警示':'⚠ 危险信号','常见误区':'容易忽略的误区'};
const safeUrl = u => /^https:\/\/[\w.-]+(?:\/|$)/i.test(String(u||'')) ? u : null;

function leaveAlert(id,message){const node=$(id);node.textContent=message;node.classList.remove('hidden')}
function clearAlert(id){$(id).classList.add('hidden')}
function makeSourceLink(s){const anchor=make('a',{href:safeUrl(s.url)||'https://datasearch.nmpa.gov.cn/',target:'_blank',rel:'noopener noreferrer'},s.name+' ↗');anchor.className='match-source';return anchor}
function filterTopics(){
 const q=$('study-keyword').value.trim().toLowerCase();
 const root=$('study-topics');root.replaceChildren();let count=0;
 for(const sys of learningState.systems){
   if(learningState.selected!=='all'&&learningState.selected!==sys.id)continue;
   const matched=sys.topics.filter(t=>!q||[t.title,sys.name,...Object.values(t.content)].join(' ').toLowerCase().includes(q));
   if(!matched.length)continue;
   count+=matched.length;
   const group=make('section',{className:'catalog-group'});
   const h=make('h2',{},sys.icon+' '+sys.name+' ');
   h.append(make('small',{},`${matched.length}个专题`));group.append(h);
   for(const t of matched){
      const btn=make('button',{type:'button',className:'catalog-row'});
      btn.append(make('strong',{},t.title),make('span',{},'学习要点 ›'));
      btn.addEventListener('click',()=>openLearningTopic(t.id));group.append(btn)
   }
   root.append(group)
 }
 $('library-counter').textContent=`当前显示 ${count} 个专题 · 共 ${learningState.systems.reduce((a,s)=>a+s.topics.length,0)} 个`;
 if(!count)root.append(make('div',{className:'empty'},'学习库暂未检索到对应主题。可进入“提问”页面提出非常规问题并保存记录。'));
}
function buildSystemPills(){const pills=$('study-filters');pills.replaceChildren();
 for(const sys of [{id:'all',name:'全部'},...learningState.systems]){
    const btn=make('button',{type:'button',className:learningState.selected===sys.id?'selected':''},sys.name);
    btn.addEventListener('click',()=>{learningState.selected=sys.id;buildSystemPills();filterTopics()});pills.append(btn)
 }
}
function openLearningTopic(id){
 let topic=null, system=null;
 for(const sys of learningState.systems){topic=sys.topics.find(t=>t.id===id);if(topic){system=sys;break}}
 if(!topic)return;
 learningState.opened=topic;
 $('learn-system-label').textContent=system.name;
 $('learn-topic-title').textContent=topic.title;
 $('learn-review-status').textContent=topic.review_status;
 const content=$('learn-content');content.replaceChildren();
 for(const [key,value] of Object.entries(topic.content)){
   const card=make('section',{className:'learn-section'+(key==='紧急警示'?' urgent':'')});
   card.append(make('h3',{},KEY_LABELS[key]||key),make('p',{},value));content.append(card)
 }
 const sources=$('learn-sources');sources.replaceChildren(make('h3',{},'原始文献与资料来源'));
 if(topic.sources.length){topic.sources.forEach(s=>{const div=make('div',{className:'learn-source'});div.append(makeSourceLink(s),make('small',{},s.kind));sources.append(div)})}
 else sources.append(make('p',{},'本专题尚未加入经过核对的原始指南链接，属于编辑性学习提纲，不应视为已核验的临床方案。'));
 setPage('learn-detail')
}
async function loadLearning(){
 let data;
 try{const resp=await fetch('/learning.json',{cache:'no-store'});if(!resp.ok)throw Error('no static library');data=await resp.json();learningState.source='local static'}
 catch{$('library-counter').textContent='无法加载完整知识库：请检查部署或网络';return}
 if(!data||!Array.isArray(data.systems)){$('library-counter').textContent='学习库格式错误';return}
 learningState.systems=data.systems;
 const home=$('home-topics');home.replaceChildren();
 learningState.systems.slice(0,8).forEach(sys=>{
   const b=make('button',{type:'button',className:'topic-card'});
   b.append(make('span',{className:'topic-icon'},sys.icon),make('strong',{},sys.name),make('small',{},`${sys.topics.length}个学习专题`));
   b.addEventListener('click',()=>{learningState.selected=sys.id;buildSystemPills();filterTopics();setPage('study')});home.append(b)
 });
 buildSystemPills();filterTopics();
}

// IndexedDB storage is on this iPhone only; no account, cloud sync, or server-side patient database.
let databasePromise;
function openJournalDb(){
 if(!databasePromise)databasePromise = new Promise((resolve,reject)=>{
 if(!('indexedDB' in window)){reject(Error('当前浏览器不支持本地数据库'));return}
 const request=indexedDB.open(NOTE_DB_NAME,1);
 request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(NOTE_STORE))request.result.createObjectStore(NOTE_STORE,{keyPath:'id'})};
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||Error('IndexedDB not available'));
 });
 return databasePromise;
}
async function journal(action,value){
 const db=await openJournalDb();
 return new Promise((resolve,reject)=>{
   const tx=db.transaction(NOTE_STORE,action==='getAll'?'readonly':'readwrite');
   const store=tx.objectStore(NOTE_STORE);
   let req;
   if(action==='getAll')req=store.getAll();
   if(action==='put')req=store.put(value);
   if(action==='delete')req=store.delete(value);
   if(!req){reject(Error('Unknown storage action'));return}
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('存储失败'));
 });
}
const noteId=()=>window.crypto?.randomUUID?.()||('n'+Date.now()+'-'+Math.floor(Math.random()*1e8));
function renderRelated(matches,container){
 if(!matches||!matches.length)return;
 const head=make('h3',{},'相关学习条目 · 请核对原始来源');container.append(head);
 matches.slice(0,5).forEach(t=>{
   const card=make('div',{className:'match-card'});
   card.append(make('strong',{},t.system+' · '+t.title));
   if(t.content)card.append(make('p',{},'检查与鉴别：'+t.content['检查与鉴别']));
   if(t.review_status)card.append(make('small',{},t.review_status));
   (t.sources||[]).forEach(s=>card.append(makeSourceLink(s)));
   const b=make('button',{type:'button',className:'outline-button'},'打开专题学习');
   b.addEventListener('click',()=>openLearningTopic(t.id));card.append(b);container.append(card)
 });
}
function localOfflineSearch(question){
 const q=question.trim().toLowerCase();let matches=[];
 learningState.systems.forEach(sys=>sys.topics.forEach(t=>{
   let score=0;
   if(q.includes(t.title))score+=20;
   const chunks=t.title.split(/[与和、/]/).filter(x=>x.length>1);
   chunks.forEach(x=>{if(q.includes(x))score+=10});
   const bi=new Set([...q].slice(0,-1).map((_,i)=>q.slice(i,i+2)));
   for(const v of bi){if(t.title.includes(v))score+=3;else if(Object.values(t.content).join(' ').includes(v))score+=.25}
   if(score>4)matches.push({score,system:sys.name,...t})
 }));
 matches.sort((a,b)=>b.score-a.score);
 matches=matches.slice(0,5);
 return {mode:'local',answer:matches.length?'离线本地知识库已找到相关学习条目，仅提供资料索引，不是对病例的诊断。':'离线知识库没有足够相关的资料，无法作出可靠分析；请向临床带教或专业文献核实。',matches,evidence:'本地编辑学习提纲，未逐条专家审定',external_sent:false}
}
function showAskResult(answer){
 const panel=$('ask-result');panel.replaceChildren(make('h2',{},answer.mode==='ai'?'AI辅助学习分析':'本地资料检索'));
 panel.append(make('div',{className:'ask-answer'},answer.answer));
 panel.append(make('p',{className:'ask-evidence'},answer.evidence+(answer.external_sent?' · 已按你的同意发送至第三方AI':' · 未向第三方AI发送')));
 renderRelated(answer.matches,panel);
 const b=make('button',{type:'button',className:'outline-button'},'查看保存的学习记录');b.addEventListener('click',()=>{setPage('notes');renderNotes()});panel.append(b);
 panel.classList.remove('hidden')
}
async function submitQuestion(e){
 e.preventDefault();clearAlert('ask-feedback');$('ask-result').classList.add('hidden');
 const question=$('ask-question').value.trim();
 if(question.length<5){leaveAlert('ask-feedback','请至少输入5个字符。');return}
 if(/\b1[3-9]\d{9}\b|\b\d{17}[\dXx]\b|住院号\s*[:：]?\s*\S+|身份证号\s*[:：]?\s*\S+/.test(question)){
    leaveAlert('ask-feedback','检测到可能的身份信息，请删除手机号、身份证号或住院号后重试。');return
 }
 const mode=document.querySelector('input[name="ask-mode"]:checked')?.value||'local';
 const consent=$('ai-consent').checked;
 if(mode==='ai'&&!consent){leaveAlert('ask-feedback','请先阅读并勾选匿名信息发送许可，或者改用本地知识库。');return}
 const button=$('ask-submit');button.disabled=true;button.textContent='正在检索…';
 let result;
 let failure='';
 try{
  if(mode==='local')result=localOfflineSearch(question);
  else{
   const answer=await DirectAPI.deepseek([
    {role:'system',content:'你是儿科临床学习助手。仅作教学审阅，不作诊断或处方。用中文回答，明确不确定性、危险征象和需由执业医生核验的事项。'},
    {role:'user',content:question}
   ]);
   result={mode:'ai',answer,matches:[],evidence:'DeepSeek 直连生成，未经过医生复核',external_sent:true};
  }
 }catch(err){
  failure=String(err.message||'请求未完成');
  // Only local mode may fall back to locally bundled knowledge; NEVER silently replace the user's explicit AI request.
  if(mode==='local'){result=localOfflineSearch(question);leaveAlert('ask-feedback','网络检索不可用，已改为本地离线资料检索。')}
  else{result={mode:'ai',answer:'AI提问未成功：'+failure+'。本次问题已记录为待复查，不提供虚构答案。',matches:[],evidence:'服务未成功返回',external_sent:false};leaveAlert('ask-feedback',failure)}
 }finally{button.disabled=false;button.textContent='检索并保存学习记录'}
 showAskResult(result);
 const created=new Date().toISOString();
 const note={id:noteId(),created_at:created,updated_at:created,tag:$('ask-tag').value,question,answer:result.answer,
    mode:result.mode, status:failure&&mode==='ai'?'待复查':result.mode==='ai'?'AI生成未审核':'学习资料检索',
    evidence:result.evidence, matched_topics:(result.matches||[]).map(x=>x.id), personal_note:'',external_sent:result.external_sent};
 try{await journal('put',note);leaveAlert('ask-feedback',failure&&mode==='ai'?'AI未返回结果，问题已作为“待复查”保存。':'学习记录已保存到本机，可在“记录”栏目继续写笔记。')}
 catch(err){leaveAlert('ask-feedback','未能写入本机数据库！请检查Safari浏览器存储权限，不要关闭页面。'+String(err.message||''))}
}
function formatTime(t){try{return new Date(t).toLocaleString('zh-CN',{hour12:false})}catch{return t}}
async function renderNotes(){
 const root=$('notes-list');root.replaceChildren();
 let notes;
 try{notes=await journal('getAll')}catch(err){root.append(make('div',{className:'empty'},'无法读取本机学习记录：'+err.message));return}
 notes.sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at)));
 const keyword=$('notes-search').value.trim().toLowerCase();
 const filtered=notes.filter(n=>[n.question,n.answer,n.tag,n.personal_note].join(' ').toLowerCase().includes(keyword));
 $('notes-count').textContent=`${filtered.length}/${notes.length}条`;
 if(!filtered.length){root.append(make('div',{className:'empty'},'暂无记录。到“提问”栏目提出一个问题，即可自动保存；也可导入已有备份。'));return}
 filtered.forEach(n=>{
  const card=make('article',{className:'note-card'});
  card.append(make('div',{className:'note-meta'},`${formatTime(n.updated_at)} · ${n.tag} · ${n.status}`),make('h3',{},n.question),make('div',{className:'note-answer'},n.answer));
  const lab=make('label',{},'我的复习笔记');const textarea=make('textarea',{className:'note-editor',rows:'3',placeholder:'记下自己的鉴别思路、复查结果或带教意见（不要填写患者身份信息）'});textarea.value=n.personal_note||'';
  const actions=make('div',{className:'note-actions'});
  const save=make('button',{type:'button'},'保存笔记');save.addEventListener('click',async()=>{
    n.personal_note=textarea.value.slice(0,2500);n.updated_at=new Date().toISOString();
    try{await journal('put',n);leaveAlert('notes-feedback','笔记已保存到本机。')}catch(err){leaveAlert('notes-feedback','笔记保存失败：'+err.message)}
  });
  const again=make('button',{type:'button'},'再次提问');again.addEventListener('click',()=>{$('ask-question').value=n.question;setPage('ask')});
  const remove=make('button',{type:'button',className:'danger-action'},'删除');remove.addEventListener('click',async()=>{
    if(!window.confirm('永久删除这条本地学习记录？删除后只能通过之前导出的备份恢复。'))return;
    try{await journal('delete',n.id);await renderNotes()}catch(err){leaveAlert('notes-feedback','删除失败：'+err.message)}
  });
  actions.append(save,again,remove);card.append(lab,textarea,actions);root.append(card)
 })
}
async function exportNotes(){
 try{
  const notes=await journal('getAll');
  const text=JSON.stringify({format:'pediatric-study-notes-v1',exported_at:new Date().toISOString(),items:notes},null,2);
  const url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));
  const a=make('a',{href:url});a.download='儿科临床学习记录_'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);
  leaveAlert('notes-feedback',`备份已发起下载（共${notes.length}条）。备份未加密，请安全保管。`)
 }catch(err){leaveAlert('notes-feedback','导出失败：'+err.message)}
}
async function importNotes(e){
 const file=e.target.files?.[0];if(!file)return;
 try{
   if(file.size>4_000_000)throw Error('备份文件超过4MB');
   const data=JSON.parse(await file.text());
   if(data.format!=='pediatric-study-notes-v1'||!Array.isArray(data.items)||data.items.length>400)throw Error('文件不是兼容的学习记录备份');
   if(!window.confirm(`将导入${data.items.length}条学习记录到这台设备；相同ID的记录会覆盖。继续？`))return;
   let count=0;
   for(const n of data.items){
     if(!n||typeof n.id!=='string'||typeof n.question!=='string'||typeof n.answer!=='string'||n.question.length>1500||n.answer.length>10000)continue;
     const clean={id:n.id.slice(0,120),created_at:String(n.created_at||new Date().toISOString()).slice(0,60),
       updated_at:String(n.updated_at||new Date().toISOString()).slice(0,60),
       question:n.question.slice(0,1500),answer:n.answer.slice(0,10000),
       tag:String(n.tag||'其他').slice(0,60),mode:['local','ai'].includes(n.mode)?n.mode:'local',
       status:String(n.status||'已导入').slice(0,60),evidence:String(n.evidence||'').slice(0,300),
       personal_note:String(n.personal_note||'').slice(0,2500),matched_topics:Array.isArray(n.matched_topics)?n.matched_topics.filter(x=>typeof x==='string').slice(0,20):[],external_sent:Boolean(n.external_sent)};
     await journal('put',clean);count++
   }
   await renderNotes();leaveAlert('notes-feedback',`已导入${count}条学习记录。`)
 }catch(err){leaveAlert('notes-feedback','导入失败：'+err.message)}
 finally{e.target.value=''}
}

$('study-keyword').addEventListener('input',filterTopics);
$('learn-back').addEventListener('click',()=>setPage('study'));
$('learn-ask').addEventListener('click',()=>{if(learningState.opened)$('ask-question').value=`请按中国儿科临床学习要求解释“${learningState.opened.title}”的鉴别诊断、关键检查、危险征象及用药核对要点，并列出需要确认的证据。`;setPage('ask')});
$('ask-form').addEventListener('submit',submitQuestion);
document.querySelectorAll('input[name="ask-mode"]').forEach(el=>el.addEventListener('change',()=>{
 $('ai-consent-box').classList.toggle('hidden',document.querySelector('input[name="ask-mode"]:checked')?.value!=='ai');
 $('ask-submit').textContent=el.value==='ai'&&el.checked?'询问AI并保存记录':'检索并保存学习记录'
}));
$('notes-search').addEventListener('input',()=>renderNotes());
$('notes-export').addEventListener('click',exportNotes);
$('notes-import-btn').addEventListener('click',()=>$('notes-import').click());
$('notes-import').addEventListener('change',importNotes);
document.querySelector('[data-page="notes"]').addEventListener('click',()=>renderNotes());
$('ai-status').textContent=DirectAPI.status().ai?'已在本设备填写 DeepSeek Key；请先匿名化。':'尚未填写 DeepSeek Key；可使用本地知识库并保存。';
loadLearning();
