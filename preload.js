const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('SBA',{
  getConfig:()=>ipcRenderer.invoke('config:get'),
  saveConfig:c=>ipcRenderer.invoke('config:save',c),
  getItems:()=>ipcRenderer.invoke('api:items'),
  update:(id,mode)=>ipcRenderer.invoke('api:update',id,mode),
  bulk:(ids,mode)=>ipcRenderer.invoke('api:bulk',ids,mode)
});
