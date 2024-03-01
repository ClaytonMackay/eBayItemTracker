const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternalLink: (url) => ipcRenderer.send('open-external-link', url),

  getSavedSearches: () => ipcRenderer.sendSync('get-saved-searches'),

  getEbayItems: () => ipcRenderer.sendSync('get-ebay-items'),

  setEbayItemsSeen: (items) => ipcRenderer.sendSync('set-ebay-items-seen', items),

  upsertSavedSearch: (savedSearch) => ipcRenderer.sendSync('upsert-saved-search', savedSearch),

  runAllSearches: () => ipcRenderer.sendSync('run-all-searches'),

  deleteSavedSearch: (savedSearch) => ipcRenderer.sendSync('delete-saved-search', savedSearch)
});