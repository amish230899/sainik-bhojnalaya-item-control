let items=[];
const $=id=>document.getElementById(id);
function toast(t){$('toast').textContent=t;$('toast').style.display='block';setTimeout(()=>{$('toast').style.display='none'},2200)}
async function connect(){
  try{
    const r=await window.SBA.getItems(); items=r.items||[]; $('conn').textContent='● Connected'; $('conn').style.color='#08752b'; render();
  }catch(e){$('conn').textContent='● Disconnected';$('conn').style.color='#a00';toast(e.message)}
}
function render(){
  const q=$('search').value.toLowerCase(), c=$('cat').value, s=$('status').value;
  const cats=new Map(); items.forEach(x=>(x.categories||[]).forEach(z=>cats.set(z.id,z.name)));
  const old=$('cat').value; $('cat').innerHTML='<option value="">All categories</option>'+[...cats].map(([id,n])=>`<option value="${id}">${n}</option>`).join('');$('cat').value=old;
  const filtered=items.filter(x=>{
    const m=x.availability.mode, okq=x.name.toLowerCase().includes(q);
    const okc=!c||(x.categories||[]).some(z=>String(z.id)===String(c)); const oks=!s||m===s; return okq&&okc&&oks;
  });
  $('items').innerHTML=filtered.map(x=>{
    const m=x.availability.mode;
    return `<div class="item" data-id="${x.id}"><div><div class="name">${esc(x.name)}</div><div class="sub">${esc((x.categories||[]).map(z=>z.name).join(', '))}${x.stock_quantity!==null?' · Stock '+x.stock_quantity:''}</div></div><div class="modes"><button class="${m==='on'?'active':''}" data-mode="on">🟢 ON</button><button class="sold ${m==='soldout'?'active':''}" data-mode="soldout">🟡 SOLD OUT</button><button class="off ${m==='off'?'active':''}" data-mode="off">🔴 OFF</button></div></div>`;
  }).join('');
  const counts={on:0,soldout:0,off:0};items.forEach(x=>counts[x.availability.mode]=(counts[x.availability.mode]||0)+1);
  $('onCount').textContent=counts.on||0;$('soldCount').textContent=counts.soldout||0;$('offCount').textContent=counts.off||0;$('totalCount').textContent=items.length;
}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
$('items').addEventListener('click',async e=>{const b=e.target.closest('button[data-mode]');if(!b)return;const row=b.closest('.item'),id=row.dataset.id,mode=b.dataset.mode;b.disabled=true;try{const x=await window.SBA.update(id,mode);const i=items.find(a=>a.id==id);if(x&&x.availability)i.availability=x.availability;render();}catch(e){toast(e.message)}finally{b.disabled=false}});
document.querySelector('.bulk').addEventListener('click',async e=>{const b=e.target.closest('button[data-bulk]');if(!b)return;const mode=b.dataset.bulk, ids=items.filter(x=>{const q=$('search').value.toLowerCase(),c=$('cat').value;return x.name.toLowerCase().includes(q)&&(!c||(x.categories||[]).some(z=>String(z.id)===String(c)))}).map(x=>x.id);try{await window.SBA.bulk(ids,mode);items.forEach(x=>{if(ids.includes(x.id))x.availability.mode=mode});render();toast('Updated '+ids.length+' items');}catch(e){toast(e.message)}});
$('search').oninput=render;$('cat').onchange=render;$('status').onchange=render;$('refresh').onclick=connect;
$('settings').onclick=async()=>{const c=await window.SBA.getConfig();$('url').value=c.baseUrl||'';$('user').value=c.username||'';$('pass').value=c.password||'';$('modal').classList.remove('hidden')};
$('closeSettings').onclick=()=>$('modal').classList.add('hidden');
$('saveSettings').onclick=async()=>{await window.SBA.saveConfig({baseUrl:$('url').value.trim(),username:$('user').value.trim(),password:$('pass').value});$('modal').classList.add('hidden');connect()};
connect();
