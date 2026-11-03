'use strict';
/* Optional encrypted exports of local teaching notes/chart drafts only.
 * AES-256-GCM, PBKDF2-SHA256 310,000 iterations, random 16-byte salt, 12-byte nonce.
 * This does NOT encrypt the underlying IndexedDB or promise hospital-grade data governance.
 */
(()=>{
 const elem=id=>document.getElementById(id);
 const panel=elem('secure-panel');
 let action='',selectedFile=null;
 const encoder=new TextEncoder(),decoder=new TextDecoder();
 const b64=u=>btoa(Array.from(u,b=>String.fromCharCode(b)).join(''));
 const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const tip=s=>{elem('secure-feedback').textContent=s};
 const random=n=>crypto.getRandomValues(new Uint8Array(n));
 const textbuf=s=>encoder.encode(s);
 const subtle=()=>{if(!globalThis.isSecureContext||!crypto?.subtle)throw Error('加密备份只支持 HTTPS 或本机 localhost 的安全环境；请先部署 HTTPS。');return crypto.subtle};
 async function derive(pass,salt){const key=await subtle().importKey('raw',textbuf(pass),'PBKDF2',false,['deriveKey']);return subtle().deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},key,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 function download(obj,name){const url=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000)}
 function open(what){action=what;selectedFile=null;elem('secure-pass').value='';elem('secure-pass-confirm').value='';elem('secure-file').value='';tip('');
   elem('secure-message').textContent='仅对导出的备份文件进行加密；iPhone本地IndexedDB记录本身未由此功能加密。忘记口令无法恢复。仅允许虚构/彻底匿名教学数据。';
   const importing=what.endsWith('import');elem('secure-pass-confirm').parentElement&&null;
   const cn=elem('secure-pass-confirm');cn.hidden=importing;cn.previousElementSibling.hidden=importing;elem('secure-file').hidden=!importing;
   panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function close(){panel.hidden=true;elem('secure-pass').value='';elem('secure-pass-confirm').value='';selectedFile=null;action=''}
 async function collect(kind){if(kind==='notes')return await journal('getAll');if(kind==='chart')return await chartStore('all');throw Error('未知类型')}
 function schemaSafe(kind,items){if(!Array.isArray(items)||items.length>400)throw Error('备份记录数量异常');const out=[];
  for(const a of items){if(!a||typeof a!=='object'||typeof a.id!=='string'||a.id.length>120)throw Error('存在无效记录ID');
   if(kind==='notes'){if(typeof a.question!=='string'||typeof a.answer!=='string'||a.question.length>1500||a.answer.length>11000)throw Error('学习记录格式无效');out.push({id:a.id,question:a.question,answer:a.answer,tag:String(a.tag||'其他').slice(0,60),mode:a.mode==='ai'?'ai':'local',status:String(a.status||'待复核').slice(0,80),created_at:String(a.created_at||new Date().toISOString()).slice(0,60),updated_at:String(a.updated_at||new Date().toISOString()).slice(0,60),personal_note:String(a.personal_note||'').slice(0,2500),evidence:String(a.evidence||'').slice(0,500),matched_topics:Array.isArray(a.matched_topics)?a.matched_topics.filter(x=>typeof x==='string').slice(0,30):[],external_sent:Boolean(a.external_sent)})}
   else{if(typeof a.text!=='string'||a.text.length>17000||!['admission','first','progress','outpatient'].includes(a.type))throw Error('病历记录格式无效');out.push({id:a.id,type:a.type,text:a.text,admit:String(a.admit||'').slice(0,50),write:String(a.write||'').slice(0,50),updated:String(a.updated||new Date().toISOString()).slice(0,60),docName:String(a.docName||'').slice(0,80),summary:String(a.summary||'').slice(0,200)})}
  }return out
 }
 async function submit(){const current=action,pass=elem('secure-pass').value;
  try{if(pass.length<12)throw Error('口令至少12字符（建议使用长且不重复的密码）。');
   const which=current.startsWith('notes')?'notes':'chart';
   if(current.endsWith('export')){
    if(pass!==elem('secure-pass-confirm').value)throw Error('两次输入的口令不一致');
    const items=schemaSafe(which,await collect(which));
    if(!items.length)throw Error('没有可以导出的教学记录');
    if(!confirm(`将加密导出${items.length}条${which==='notes'?'学习':'病历学习'}记录。确认没有真实患者身份信息吗？`))return;
    const payload=JSON.stringify({format:'pediatric-cn-study-v1',kind:which,items,created:new Date().toISOString()});
    if(payload.length>5e6)throw Error('备份超过大小限制');
    const salt=random(16),iv=random(12),key=await derive(pass,salt);
    const cipher=new Uint8Array(await subtle().encrypt({name:'AES-GCM',iv},key,textbuf(payload)));
    download({format:'pediatric-cn-encrypted-v1',kind:which,kdf:'PBKDF2-SHA256',iterations:310000,salt:b64(salt),nonce:b64(iv),ciphertext:b64(cipher)},'儿科教学_'+which+'_加密备份_'+new Date().toISOString().slice(0,10)+'.json');
    tip('已发起加密备份下载。请到iPhone“文件”中确认保存；务必妥善保管口令。');
   } else {
    const file=elem('secure-file').files?.[0];if(!file)throw Error('请先选择加密备份文件');if(file.size>8e6)throw Error('加密备份文件超过8MB');
    const envelope=JSON.parse(await file.text());if(envelope.format!=='pediatric-cn-encrypted-v1'||envelope.kind!==which||envelope.kdf!=='PBKDF2-SHA256'||envelope.iterations!==310000)throw Error('备份格式/类别不匹配');
    const salt=unb64(envelope.salt),iv=unb64(envelope.nonce),cipher=unb64(envelope.ciphertext);
    if(salt.length!==16||iv.length!==12||cipher.length>6e6)throw Error('备份参数不合法');
    let raw;try{const key=await derive(pass,salt);raw=decoder.decode(await subtle().decrypt({name:'AES-GCM',iv},key,cipher))}catch{throw Error('口令错误或备份已被篡改，无法解密。')}
    const data=JSON.parse(raw);if(data.format!=='pediatric-cn-study-v1'||data.kind!==which)throw Error('内部备份数据格式错误');
    const items=schemaSafe(which,data.items);
    if(!confirm(`准备向当前iPhone追加${items.length}条匿名教学记录。相同ID将跳过，是否继续？`))return;
    const existing=new Set((await collect(which)).map(x=>x.id));let added=0;
    for(const row of items){if(existing.has(row.id))continue; if(which==='notes')await journal('put',row);else await chartStore('put',row);added++}
    if(which==='notes')await renderNotes();else await chartHistory();tip('成功追加'+added+'条记录（跳过已有ID '+(items.length-added)+'条）。');
   }
  }catch(err){tip('无法完成操作：'+String(err.message||err))}finally{elem('secure-pass').value='';elem('secure-pass-confirm').value=''}
 }
 for(const [id,name] of [['notes-secure-export','notes-export'],['notes-secure-import','notes-import'],['chart-secure-export','chart-export'],['chart-secure-import','chart-import']])elem(id).addEventListener('click',()=>open(name));
 elem('secure-continue').addEventListener('click',submit);elem('secure-cancel').addEventListener('click',close);
})();
