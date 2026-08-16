const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');
code = code.replace(/<\/div>\s*<\/div>\s*\{\/\* Right Panel: Hand \*\/\}/m, '</div>\n{/* Right Panel: Hand */}');
fs.writeFileSync('src/GameEngine.tsx', code);
