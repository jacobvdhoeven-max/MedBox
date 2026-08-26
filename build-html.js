// Wraps dist/bundle.js into a single self-contained dist/index.html, and
// copies the PWA assets (manifest, service worker, icons) from public/ into
// dist/ so the app can be installed to a home screen / app list.
// Run automatically by `npm run build` (after esbuild produces bundle.js).
const fs = require("fs");
const path = require("path");

const bundlePath = path.join(__dirname, "dist", "bundle.js");
const outPath = path.join(__dirname, "dist", "index.html");
const publicDir = path.join(__dirname, "public");
const distDir = path.join(__dirname, "dist");

let bundle = fs.readFileSync(bundlePath, "utf-8");
bundle = bundle.replace(/<\/script/g, "<\\/script");

if (fs.existsSync(publicDir)) {
  for (const file of fs.readdirSync(publicDir)) {
    fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
  }
}

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>MedBox</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2F6B5E">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="MedBox">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>
  :root { color-scheme: light dark; }
  html, body { margin: 0; padding: 0; background: #EEF2EE; }
  #root { min-height: 100vh; }
  * { box-sizing: border-box; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
</style>
</head>
<body>
<div id="root">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;color:#446056;font-family:'Nunito',sans-serif;">MedBox laden&hellip;</div>
</div>
<script>
${bundle}
</script>
</body>
</html>
`;

fs.writeFileSync(outPath, html);
console.log("Geschreven:", outPath, `(${html.length} bytes)`);
