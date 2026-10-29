'use strict';
/* V0.6: local crop preview, opt-in transient OCR on the configured self-hosted server.
 * No auto-diagnosis and no auto-submission of OCR-derived values to a clinical decision.
 */
(function(){
const $=(root,q)=>root.querySelector(q);
const elem=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const clamp=(v)=>Math.max(0,Math.min(90,Number(v)||0));
const states=new WeakMap();
async function decodeImage(file){
 const url=URL.createObjectURL(file);
 try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('浏览器无法读取图片，可先在相册转成JPEG后重试'));image.src=url;});return image;}
 finally{ /* URL kept until image draw completes below; revoke in image onload read */ }
}
function cropDimensions(panel){
 const left=clamp($(panel,'.ocr-crop-left').value),right=clamp($(panel,'.ocr-crop-right').value),top=clamp($(panel,'.ocr-crop-top').value),bottom=clamp($(panel,'.ocr-crop-bottom').value);
 if(left+right>=94||top+bottom>=94)throw new Error('裁切过多，剩余区域过小');
 return {left,right,top,bottom};
}
function renderCrop(panel){
 const state=states.get(panel);if(!state?.img)return;
 const c=cropDimensions(panel),src=state.img,canvas=$(panel,'.ocr-preview');
 const x=src.naturalWidth*c.left/100, y=src.naturalHeight*c.top/100;
 const sw=src.naturalWidth*(100-c.left-c.right)/100, sh=src.naturalHeight*(100-c.top-c.bottom)/100;
 if(sw<100||sh<100)throw new Error('裁切后图片太小，不适合识别');
 const scale=Math.min(1,2200/Math.max(sw,sh),Math.sqrt(8_000_000/(sw*sh)));
 canvas.width=Math.max(1,Math.round(sw*scale));canvas.height=Math.max(1,Math.round(sh*scale));
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('浏览器不支持图片裁切');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(src,x,y,sw,sh,0,0,canvas.width,canvas.height);
 state.crop=c;
}
function canvasBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('JPEG转换失败；建议改用Safari或其他JPEG图片')), 'image/jpeg',0.9));}
function updateStatus(panel,text){$(panel,'.ocr-status').textContent=text;}
function getCandidateRows(raw){
 // OCR is noisy: only propose a value when a known code/name appears in the SAME line.
 // Reference limits are never invented. The learner must compare everything to the source.
 const data=typeof clinicalData!=='undefined'?clinicalData:null;
 if(!data?.lab_tests)return [];
 const rows=[],used=new Set();
 for(const line of raw.split(/\r?\n/).slice(0,120)){
  const txt=line.trim();if(!txt)continue;
  const candidates=data.lab_tests.filter(t=>(t.name.length>=2&&txt.includes(t.name))||new RegExp('(^|[^A-Za-z])'+t.code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^A-Za-z]|$)','i').test(txt));
  for(const t of candidates.slice(0,2)){
   if(used.has(t.code))continue;
   const starts=[];if(txt.includes(t.name))starts.push(txt.indexOf(t.name)+t.name.length);
   const codeAt=txt.toLowerCase().indexOf(t.code.toLowerCase());if(codeAt>=0)starts.push(codeAt+t.code.length);
   if(!starts.length)continue;
   const after=txt.slice(Math.min(...starts)).replace(/^[\s:：|,，]+/,'');
   const match=after.match(/(?:^|\s)([-+]?\d{1,6}(?:\.\d{1,5})?)(?!\d)/);
   if(!match)continue;
   const value=match[1];const unit=txt.includes(t.unit)?t.unit:'[请核对单位]';
   rows.push({code:t.code,name:t.name,value,unit,source:txt.slice(0,145)});used.add(t.code);
   if(rows.length>=35)return rows;
  }
 }
 return rows;
}
function analyzeCandidates(panel){
 const type=panel.dataset.ocrType,txt=$(panel,'.ocr-text').value.trim(),out=$(panel,'.ocr-candidates');out.replaceChildren();
 if(!txt){updateStatus(panel,'请先使用OCR识别，或粘贴来自iPhone“实况文本”的内容。');return;}
 if(type==='exams'){
  const btn=elem('button','把文字放入检查报告解读（仍需人工确认）','outline-button');btn.type='button';
  btn.onclick=()=>{document.getElementById('exam-text').value=txt.slice(0,5000);document.getElementById('exam-text').focus();updateStatus(panel,'已复制到检查报告文字框；确认纠错后，再点击“提取并解释术语”。');};
  out.append(elem('p','OCR不能识别图像病灶，仅从检查报告文字中匹配词典术语。'),btn);return;
 }
 const rows=getCandidateRows(txt);
 out.append(elem('p',`找到${rows.length}个可疑化验项目。OCR可能错认小数点、单位和项目；绝不自动确定儿童参考范围。`));
 for(const row of rows){const card=elem('div',undefined,'ocr-row');card.append(elem('strong',row.name+'：'+row.value+' '+row.unit));card.append(elem('small','原文片段：'+row.source));out.append(card);}
 if(!rows.length){out.append(elem('p','没有可靠的项目-数值对。请检查识别原文，或者按下方“项目|数值|单位|下限|上限”格式手动整理。'));return;}
 const btn=elem('button','复制候选到多项报告框（不含参考限）','outline-button');btn.type='button';
 btn.onclick=()=>{const r=rows.map(x=>`${x.code} | ${x.value} | ${x.unit} | - | -`).join('\n');document.getElementById('lab-rows').value=r;document.getElementById('lab-rows').focus();updateStatus(panel,'已填入候选数据。请逐项纠正识别结果、补充报告对应参考范围；不能将OCR结果直接作为诊断/医嘱。');};
 out.append(btn);
}
async function uploadOne(panel){
 const state=states.get(panel),consent=$(panel,'.ocr-consent'),code=$(panel,'.ocr-code').value.trim(),btn=$(panel,'.ocr-start');
 if(!state?.img){updateStatus(panel,'请先选择报告图片。');return;}
 if(!consent.checked){updateStatus(panel,'未勾选本次去标识化图片上传同意，不会发送。');return;}
 if(code.length<8){updateStatus(panel,'请输入服务器设置的至少8位OCR访问码。');return;}
 try{
  renderCrop(panel);btn.disabled=true;updateStatus(panel,'正在临时识别裁切图像…');
  const jpeg=await canvasBlob($(panel,'.ocr-preview'));
  if(jpeg.size>8_000_000)throw new Error('图片超过8MB，请继续裁切');
  const fd=new FormData();fd.append('image',jpeg,'teaching_report.jpg');fd.append('consent','yes');fd.append('report_type',panel.dataset.ocrType);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),40000);
  let response;
  try{response=await fetch('/api/ocr/recognize',{method:'POST',body:fd,headers:{'X-OCR-Access':code},cache:'no-store',signal:controller.signal});}
  finally{clearTimeout(timer);}
  let data;try{data=await response.json()}catch{data={};}
  if(!response.ok)throw new Error(typeof data.detail==='string'?data.detail:'OCR服务未响应，请核对网络、权限和中文识别引擎');
  $(panel,'.ocr-text').value=String(data.text||'').slice(0,9000);
  updateStatus(panel,'已返回文字，未自动生成诊断。请人工核对原图；本次不自动储存或发送AI。');
  $(panel,'.ocr-consent').checked=false;$(panel,'.ocr-code').value='';
 }catch(e){updateStatus(panel,e.name==='AbortError'?'OCR响应超时，请使用实况文本复制或手动填写。':(e.message||'无法识别'));}
 finally{btn.disabled=false;}
}
async function handleFile(panel,file){
 if(!file)return;
 if(file.size>20_000_000){updateStatus(panel,'选择的文件超过20MB，请先缩小或裁切。');return;}
 const state=states.get(panel);
 if(state?.url)URL.revokeObjectURL(state.url);
 const url=URL.createObjectURL(file),img=new Image();
 try{await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error('当前Safari无法解码这张图片，可先在相册中转为JPEG'));img.src=url;});
  states.set(panel,{img,url});$(panel,'.ocr-image-panel').classList.remove('hidden');$(panel,'.ocr-consent').checked=false;renderCrop(panel);updateStatus(panel,'已在本机显示裁切预览，尚未上传。请认真检查预览中无身份信息。');
 }catch(e){URL.revokeObjectURL(url);updateStatus(panel,e.message||'图片打开失败');}
}
function setup(panel){
 $(panel,'.ocr-file').addEventListener('change',e=>handleFile(panel,e.target.files?.[0]));
 for(const input of panel.querySelectorAll('.ocr-crop-controls input'))input.addEventListener('input',()=>{
  $(panel,'.ocr-consent').checked=false;
  try{renderCrop(panel);updateStatus(panel,'裁切范围改变，需重新核对图片并勾选同意。');}catch(e){updateStatus(panel,e.message)}
 });
 $(panel,'.ocr-start').addEventListener('click',()=>uploadOne(panel));
 $(panel,'.ocr-extract').addEventListener('click',()=>analyzeCandidates(panel));
}
document.querySelectorAll('.photo-import-panel').forEach(setup);
})();
