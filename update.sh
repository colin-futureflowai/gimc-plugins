#!/bin/sh
# Bouwt de GIMC-plugin opnieuw uit ../gimc-app (main) en zet de versie in de marketplace gelijk.
# Daarna: controleren, committen en pushen; Claude haalt de nieuwe versie zelf op.
set -e
here=$(cd "$(dirname "$0")" && pwd)
app="$here/../gimc-app"
rm -rf "$here/plugins/gimc"
node "$app/scripts/build-plugin.mjs" --mcp-url https://gimc-app.vercel.app/api/mcp --production --out "$here/plugins"
rm -f "$here/plugins/gimc.plugin"
version=$(node -p "require('$here/plugins/gimc/.claude-plugin/plugin.json').version")
node -e "
const f='$here/.claude-plugin/marketplace.json', m=require(f)
m.plugins.find(p => p.name === 'gimc').version = '$version'
require('fs').writeFileSync(f, JSON.stringify(m, null, 2) + '\n')
"
claude plugin validate "$here" >/dev/null && echo "Klaar: gimc $version. Nu: git add -A && git commit -m \"gimc $version\" && git push"
