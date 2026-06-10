const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("videooDesktop", {
  platform: process.platform,
  openNewTab: (path = "/new") => ipcRenderer.invoke("videoo:new-tab", path),
  onNavigate: (callback) => {
    ipcRenderer.on("videoo:navigate", (_event, path) => callback(path));
  },
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});
