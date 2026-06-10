const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");

const isDev = !app.isPackaged;
const devServerUrl = process.env.NEXT_DEV_SERVER_URL || "http://localhost:3000";
let mainWindow = null;
let nextProcess = null;

function logStartupError(error) {
  console.error("[Videoo Editor]", error);
}

function getStandaloneDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "app.asar.unpacked", ".next", "standalone");
  }

  return path.join(app.getAppPath(), ".next", "standalone");
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

function waitForPort(port, retries = 80) {
  return new Promise((resolve, reject) => {
    const tryConnect = (attempt) => {
      const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
        socket.end();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();

        if (attempt >= retries) {
          reject(new Error(`Next server did not start on port ${port}.`));
          return;
        }

        setTimeout(() => tryConnect(attempt + 1), 250);
      });
    };

    tryConnect(0);
  });
}

async function startNextServer() {
  const standaloneDir = getStandaloneDir();
  const serverPath = path.join(standaloneDir, "server.js");
  const port = await getFreePort();

  nextProcess = spawn(process.execPath, [serverPath], {
    cwd: standaloneDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
    stdio: "ignore",
  });

  nextProcess.on("exit", () => {
    nextProcess = null;
  });

  await waitForPort(port);

  return `http://127.0.0.1:${port}`;
}

function createMenu() {
  const template = [
    ...(process.platform === "darwin"
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New Tab",
          accelerator: "CommandOrControl+T",
          click: () => {
            navigateInWindow("/new");
          },
        },
        { type: "separator" },
        process.platform === "darwin" ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function createWindow(startUrl) {
  const browserWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    title: "Videoo Editor",
    backgroundColor: "#0b0b0f",
    show: false,
    ...(process.platform === "darwin"
      ? {
          titleBarStyle: "hiddenInset",
          trafficLightPosition: { x: 14, y: 13 },
        }
      : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  mainWindow = browserWindow;

  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  browserWindow.webContents.on("will-navigate", (event, url) => {
    const target = new URL(url);
    const appHostnames = new Set(["localhost", "127.0.0.1"]);

    if (!appHostnames.has(target.hostname)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  await browserWindow.loadURL(startUrl);

  return browserWindow;
}

function navigateInWindow(routePath = "/new", targetWindow = BrowserWindow.getFocusedWindow()) {
  if (!targetWindow || targetWindow.isDestroyed()) return;
  const safePath = typeof routePath === "string" && routePath.startsWith("/") ? routePath : "/new";
  targetWindow.webContents.send("videoo:navigate", safePath);
  targetWindow.focus();
}

process.on("uncaughtException", logStartupError);
process.on("unhandledRejection", logStartupError);

app.whenReady().then(async () => {
  createMenu();

  const startUrl = isDev ? devServerUrl : await startNextServer();
  await createWindow(startUrl);

  ipcMain.handle("videoo:new-tab", (_event, routePath = "/new") => {
    navigateInWindow(routePath, BrowserWindow.getFocusedWindow());
    return { ok: true };
  });

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow(startUrl);
    }
  });
}).catch((error) => {
  logStartupError(error);
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextProcess) {
    nextProcess.kill();
    nextProcess = null;
  }
});
