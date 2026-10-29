'use strict';
/* Transparent, offline educational practice. Not medical adjudication. */
(()=>{
 const el=id=>document.getElementById(id);
 const node=(tag,text,cls)=>{let x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x};
 const localKey='pediatric-cn-v1-quiz-mistakes';
 let bank=null, sources=null, questionList=[], cursor=0, answered=false, correctCount=0;
 const record=()=>{try{const j=JSON.parse(localStorage.getItem(localKey)||'{}');return j&&typeof j==='object'&&!Array.isArray(j)?j:{}}catch{return {}}};
 const putRecord=(r)=>{try{localStorage.setItem(localKey,JSON.stringify(r))}catch{el('quiz-info').textContent+='（当前浏览器未允许保存练习进度）'}};
 function linkFor(sourceId){return sources?.sources?.find(x=>x.id===sourceId)}
 function urls(identifiers,container){(identifiers||[]).forEach(id=>{let s=linkFor(id);if(!s)return;let a=node('a',s.title+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.style.display='block';a.style.marginTop='6px';container.append(a)})}
 async function loadBundle(name){const r=await fetch('/'+name+'.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}
 async function start(){try{[bank,sources]=await Promise.all([loadBundle('quiz_cases'),loadBundle('source_registry')]);
  if(!Array.isArray(bank.items)||!Array.isArray(sources.sources))throw Error('学习数据格式不符');
  const cats=[...new Set(bank.items.map(x=>x.category))];const sel=el('quiz-category');sel.append(...cats.map(c=>{let o=node('option',c);o.value=c;return o}));
  el('quiz-info').textContent=`已载入${bank.items.length}道教学题；不需要AI API，离线缓存后可以练习。`;
  buildEvidence();begin();
 }catch(err){el('quiz-info').textContent='练习题库载入失败：'+String(err.message||err);el('evidence-policy').textContent='当前未成功载入权威资料索引，请检查版本部署。'}}
 function begin(){if(!bank)return;const cat=el('quiz-category').value,mode=el('quiz-mode').value,history=record();
  questionList=bank.items.filter(x=>(cat==='all'||x.category===cat)&&(mode==='all'||history[x.id]==='wrong'));
  cursor=0;correctCount=0;answered=false;draw();
 }
 function draw(){const root=el('quiz-work');root.replaceChildren();if(!questionList.length){el('quiz-info').textContent='这个筛选条件没有题目，或尚无错题。';return}
  if(cursor>=questionList.length){const total=questionList.length;el('quiz-info').textContent=`练习完成：${correctCount}/${total}题正确。错题可在“仅复习错题”中再次练习。`;
   root.append(node('p','本轮已结束，请按“开始/重置练习”进行新一轮。','check-result'));return}
  const q=questionList[cursor],box=node('article',undefined,'quiz-question');
  el('quiz-info').textContent=`第 ${cursor+1} / ${questionList.length} 题 · 本轮已答对 ${correctCount} 题`;
  box.append(node('div',q.category+' · '+q.level+' · 教学拟题（未专家逐题审定）','quiz-head'),node('h3',q.stem));
  const choiceNodes=[];q.choices.forEach((choice,index)=>{const b=node('button',String.fromCharCode(65+index)+'．'+choice,'quiz-choice');b.type='button';choiceNodes.push(b);b.addEventListener('click',()=>{
    if(answered)return;answered=true;const right=index===q.correct;if(right)correctCount++;
    const state=record();state[q.id]=right?'correct':'wrong';putRecord(state);
    choiceNodes.forEach((it,i)=>{it.disabled=true;if(i===q.correct)it.classList.add('right');else if(i===index)it.classList.add('wrong')});
    const explanation=node('div',undefined,'quiz-explain');explanation.append(node('strong',right?'✓ 本题回答正确':'需复盘：本题答案为 '+String.fromCharCode(65+q.correct)),node('p',q.explanation));
    if(q.pitfall)explanation.append(node('p','易错点：'+q.pitfall));
    explanation.append(node('p','证据：请查看原始指南/规范；本题解释属于编辑整理。'));urls(q.source_ids,explanation);
    box.append(explanation);const next=node('button',cursor+1>=questionList.length?'完成本轮':'下一题 ›','primary-button quiz-next');next.type='button';next.addEventListener('click',()=>{cursor++;answered=false;draw()});box.append(next)
  });box.append(b)});root.append(box)
 }
 function buildEvidence(){if(!sources||!bank)return;
  fetch('/clinical_extension.json').then(r=>r.json()).then(cl=>{
   const count=cl.clinical_paths?.length||0;
   const trace=cl.clinical_paths?.filter(x=>Array.isArray(x.sources)&&x.sources.length).length||0;
   const examples=[['结构化诊疗路径',String(count)+'条（全部需专家逐条审校）'],['路径有来源链接',String(trace)+'条；链接不等于逐句验证'],['路径缺少来源链接',String(count-trace)+'条'],['检验指标词典',String(cl.lab_tests?.length||0)+'项（待逐项审校）'],['影像/检查术语',String(cl.examination_terms?.length||0)+'项（待专科审核）'],['指南相关教学题',String(bank.items.length)+'题（已核对入口，未专家逐题审校）'],['权威公开资料入口',String(sources.sources.length)+'项']];
   let root=el('evidence-stats');root.replaceChildren();examples.forEach(([k,v])=>{let r=node('div',undefined,'quality-row');r.append(node('span',k),node('strong',v));root.append(r)})
  }).catch(()=>{el('evidence-stats').textContent='无法载入临床路径统计，仍可查看下方来源索引。'});
  el('evidence-policy').textContent='数据分级：国家规范与标准原始链接 ≠ 每条医学摘要经过审核；商业药品查询 ≠ 国家药监局官方实时核验；AI回复 ≠ 专家审签。';
  const root=el('evidence-list');root.replaceChildren();sources.sources.forEach(s=>{
   const box=node('article',undefined,'evidence-source');box.append(node('h3',s.title),node('p',s.issuer+' · '+(s.year||'持续查询')+' · '+s.kind),node('p','适用范围：'+s.scope));urls([s.id],box);root.append(box)
  })
 }
 el('quiz-restart').addEventListener('click',begin);
 el('quiz-category').addEventListener('change',begin);
 el('quiz-mode').addEventListener('change',begin);
 el('quiz-clear').addEventListener('click',()=>{if(!confirm('清除本机练习正确/错误记录？这不会影响提问和病历笔记。'))return;localStorage.removeItem(localKey);begin()});
 start();
})();
