// LightLearn AI for Windows, Linux (and macOS).
// Opens the online app (accounts, sync, plans). Without internet it opens the built-in offline copy.
const { app, BrowserWindow, shell, Menu, dialog, session, screen } = require("electron");
const path = require("path");

const ONLINE = process.env.LLAI_URL || "https://www.lightlearnai.com/app/";
const OFFLINE = path.join(__dirname, "app", "offline", "index.html");
// Pages the app may show inside its own windows: the app itself and sign-in / payment pages.
const INSIDE = [
  /^https:\/\/(www\.)?lightlearnai\.com(\/|$)/,
  /^https:\/\/[a-z0-9-]+\.firebaseapp\.com\//,
  /^https:\/\/accounts\.google\.com\//,
  /^https:\/\/appleid\.apple\.com\//,
  /^https:\/\/(www|m)\.facebook\.com\//,
  /^https:\/\/steamcommunity\.com\/openid/,
  /^https:\/\/(checkout|billing)\.stripe\.com\//
];
const inside = url => INSIDE.some(r => r.test(url));
const isOffline = url => url.startsWith("file://");

let win = null;
const T = (ro, en) => (app.getLocale() || "").toLowerCase().startsWith("ro") ? ro : en;

function secureWindow(opts) {
  return Object.assign({
    backgroundColor: "#05050C",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, webSecurity: true, spellcheck: false }
  }, opts);
}

function guard(contents) {
  // Links to other sites open in the normal browser; nothing else may take over the app window.
  contents.setWindowOpenHandler(({ url }) => {
    if (inside(url)) return { action: "allow", overrideBrowserWindowOptions: secureWindow({ width: 520, height: 720, parent: win, modal: false }) };
    if (/^https:\/\//.test(url) || /^mailto:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  contents.on("will-navigate", (e, url) => {
    if (inside(url) || isOffline(url)) return;
    e.preventDefault();
    if (/^https:\/\//.test(url) || /^mailto:/.test(url)) shell.openExternal(url);
  });
  contents.on("will-attach-webview", e => e.preventDefault());
}

function loadOffline() { win.loadFile(OFFLINE); }
function loadOnline() {
  let done = false;
  const timer = setTimeout(() => { if (!done) loadOffline(); }, 12000);   // slow or no connection
  win.webContents.once("did-finish-load", () => { done = true; clearTimeout(timer); });
  win.loadURL(ONLINE).catch(() => { done = true; clearTimeout(timer); loadOffline(); });
}

function createWindow() {
  win = new BrowserWindow(secureWindow({ width: 460, height: 860, minWidth: 360, minHeight: 600, title: "LightLearn AI", show: false }));
  win.once("ready-to-show", () => {
    // Phones and small tablets (Linux phones such as PinePhone or Librem 5): use the whole screen.
    const wa = screen.getPrimaryDisplay().workAreaSize;
    if (wa.width < 720 || wa.height < 700) win.maximize();
    win.show();
  });
  win.webContents.on("did-fail-load", (e, code, desc, url, isMain) => { if (isMain && !isOffline(url) && code !== -3) loadOffline(); });
  loadOnline();
}

function menu() {
  const tpl = [
    { label: "LightLearn AI", submenu: [
      { label: T("Versiunea online", "Online version"), click: () => loadOnline() },
      { label: T("Versiunea offline", "Offline version"), click: () => loadOffline() },
      { type: "separator" },
      { label: T("Site-ul LightLearn AI", "LightLearn AI website"), click: () => shell.openExternal("https://www.lightlearnai.com") },
      { label: T("Despre", "About"), click: () => dialog.showMessageBox(win, { type: "info", title: "LightLearn AI", message: "LightLearn AI " + app.getVersion(), detail: T("Învață AI ușor, de la zero la expert, în 5 minute pe zi.\nwww.lightlearnai.com", "Learn AI the easy way, from zero to expert, 5 minutes a day.\nwww.lightlearnai.com") }) },
      { type: "separator" },
      { role: "quit", label: T("Ieșire", "Quit") }
    ]},
    { label: T("Vizualizare", "View"), submenu: [
      { role: "reload", label: T("Reîncarcă", "Reload") },
      { role: "resetZoom", label: T("Mărime normală", "Actual size") },
      { role: "zoomIn", label: T("Mărește", "Zoom in") },
      { role: "zoomOut", label: T("Micșorează", "Zoom out") },
      { type: "separator" },
      { role: "togglefullscreen", label: T("Ecran complet", "Full screen") }
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    // Only the permissions the app needs: notifications (streak reminders). Camera, microphone, location: refused.
    session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(perm === "notifications" || perm === "clipboard-sanitized-write"));
    app.on("web-contents-created", (e, contents) => guard(contents));
    menu(); createWindow();
    app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
