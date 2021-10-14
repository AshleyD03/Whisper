const { ipcRenderer, contextBridge } = require('electron');
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel) => ipcRenderer.send(channel),
  invoke: async (channel, args) => await ipcRenderer.invoke(channel, args),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener)
})