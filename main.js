const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
const configPath = path.join(app.getPath('userData'), 'config.json');

function loadConfig(){
  try { return JSON.parse(fs.readFileSync(configPath,'utf8')); } catch(e){ return {baseUrl:'',username:'',password:''}; }
}
function saveConfig(c){ fs.writeFileSync(configPath, JSON.stringify(c)); }

function createWindow(){
  win = new BrowserWindow({
    width: 1250, height: 820, minWidth: 900, minHeight: 650,
    title: 'Sainik Bhojnalaya — Item Control',
    webPreferences: { preload:path.join(__dirname,'preload.js'), contextIsolation:true, nodeIntegration:false }
  });
  win.loadFile('index.html');
}
app.whenReady().then(createWindow);
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});

ipcMain.handle('config:get',()=>loadConfig());
ipcMain.handle('config:save',(_,c)=>{saveConfig(c);return true;});

async function apiFetch(method, endpoint, body){
  const c=loadConfig();
  if(!c.baseUrl) throw new Error('Please enter your WooCommerce site URL in Settings.');
  const url=c.baseUrl.replace(/\/$/,'') + '/wp-json/sba/v1/' + endpoint.replace(/^\//,'');
  const headers={'Content-Type':'application/json'};
  // Uses Basic Auth for the desktop prototype. For production, use application passwords or a dedicated token backend.
  if(c.username && c.password){
    headers.Authorization='Basic '+Buffer.from(c.username+':'+c.password).toString('base64');
  }
  const res=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch(e){data={message:text}};
  if(!res.ok) throw new Error(data.message||data.code||`HTTP ${res.status}`);
  return data;
}
ipcMain.handle('api:items',async()=>apiFetch('GET','items'));
ipcMain.handle('api:update',async(_,id,mode)=>apiFetch('POST',`items/${id}`,{mode}));
ipcMain.handle('api:bulk',async(_,ids,mode)=>apiFetch('POST','items/bulk',{product_ids:ids,mode}));
