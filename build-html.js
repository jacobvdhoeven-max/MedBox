// Wraps dist/bundle.js into a single self-contained dist/index.html.
// Run automatically by `npm run build` (after esbuild produces bundle.js).
const fs = require("fs");
const path = require("path");

const bundlePath = path.join(__dirname, "dist", "bundle.js");
const outPath = path.join(__dirname, "dist", "index.html");

let bundle = fs.readFileSync(bundlePath, "utf-8");
bundle = bundle.replace(/<\/script/g, "<\\/script");

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>MedBox</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
