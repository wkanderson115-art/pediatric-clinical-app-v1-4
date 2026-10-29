const fs=require('fs'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const source=fs.readFileSync(require('path').join(__dirname,'../web/secure-backup.js'),'utf8');
const registry={}; const el=id=>registry[id] ||= {id,value:'',hidden:false,files:[],textContent:'',previousElementSibling:{hidden:false},callbacks:{},addEventListener(n,f){this.callbacks[n]=f},scrollIntoView(){}};
const blobs={};let urlNo=0,lastUrl=null;
const mockDocument={getElementById:el,createElement(tag){return {style:{},set href(v){this._href=v},get href(){return this._href},download:'',click(){lastUrl=this._href},remove(){}}},body:{append(){}}};
const content='本地儿童临床模拟学习记录，无身份信息';
const items=[{id:'unit-1',question:'疑难模拟：儿童支原体肺炎如何鉴别？',answer:content,tag:'呼吸系统',status:'教学模拟',created_at:'2026-10-29T00:00:00Z',updated_at:'2026-10-29T00:00:00Z'}];
const db=items.slice();
const env={document:mockDocument,crypto:webcrypto,isSecureContext:true,btoa,atob,TextEncoder,TextDecoder,Blob,
 URL:{createObjectURL(blob){const u='blob:fake-'+(++urlNo);blobs[u]=blob;return u},revokeObjectURL(){}},setTimeout(){},
 confirm(){return true},journal:async(action,item)=>action==='getAll'?db:action==='put'?(db.push(item),true):null,
 chartStore:async(action)=>action==='all'?[]:true,renderNotes:async()=>{},chartHistory:async()=>{},console};
vm.runInNewContext(source,env);
async function main(){
 el('notes-secure-export').callbacks.click();
 el('secure-pass').value='correct-horse-battery-staple';el('secure-pass-confirm').value='correct-horse-battery-staple';
 await el('secure-continue').callbacks.click();
 assert(lastUrl,'download created');
 const data=JSON.parse(await blobs[lastUrl].text());
 assert.equal(data.format,'pediatric-cn-encrypted-v1');
 assert(!JSON.stringify(data).includes(content));
 assert(!JSON.stringify(data).includes('疑难模拟'));
 const salt=Uint8Array.from(atob(data.salt),x=>x.charCodeAt(0));
 const keyMaterial=await webcrypto.subtle.importKey('raw',new TextEncoder().encode('correct-horse-battery-staple'),'PBKDF2',false,['deriveKey']);
 const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},keyMaterial,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const iv=Uint8Array.from(atob(data.nonce),x=>x.charCodeAt(0));
 const cipher=Uint8Array.from(atob(data.ciphertext),x=>x.charCodeAt(0));
 const decrypted=JSON.parse(new TextDecoder().decode(await webcrypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher)));
 assert.equal(decrypted.items[0].question,items[0].question);
 // an import with incorrect passphrase cannot result in new records
 el('notes-secure-import').callbacks.click();el('secure-file').files=[{size:Buffer.byteLength(JSON.stringify(data)),text:async()=>JSON.stringify(data)}];
 el('secure-pass').value='incorrect-passphrase123';await el('secure-continue').callbacks.click();
 assert(el('secure-feedback').textContent.includes('口令错误'));assert.equal(db.length,1);
 // correct passphrase import should safely skip duplicate record
 el('secure-pass').value='correct-horse-battery-staple';await el('secure-continue').callbacks.click();assert.equal(db.length,1);
 console.log('AES-GCM encryption, decryption, wrong-password rejection, duplicate guard: PASS');
}
main().catch(e=>{console.error(e);process.exit(1)});
