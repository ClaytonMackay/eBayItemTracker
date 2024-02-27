const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchItems: (searchTerm) => ipcRenderer.send('fetch-items', searchTerm),
  onFetchItemsResponse: (callback) => ipcRenderer.on('fetch-items-response', callback),
  removeFetchItemsResponseListener: () => ipcRenderer.removeAllListeners('fetch-items-response')
});