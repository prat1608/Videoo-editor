const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const staticSource = path.join(root, ".next", "static");
const staticTarget = path.join(standaloneDir, ".next", "static");
const publicSource = path.join(root, "public");
const publicTarget = path.join(standaloneDir, "public");

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.rmSync(target, { force: true, recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

if (!fs.existsSync(path.join(standaloneDir, "server.js"))) {
  throw new Error("Missing .next/standalone/server.js. Run `npm run build` first.");
}

copyDirectory(staticSource, staticTarget);
copyDirectory(publicSource, publicTarget);

console.log("Prepared Next standalone assets for Electron.");
