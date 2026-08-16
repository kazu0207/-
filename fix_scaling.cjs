const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /<div \n\s*className="flex flex-col items-center p-2 sm:p-4 bg-slate-900\/60 rounded-2xl shadow-2xl border border-slate-700\/50 backdrop-blur-md origin-center transition-transform duration-300"\n\s*style=\{\{ transform: \`scale\(\$\{scaleFactor\}\)\` \}\}\n\s*>/;

const newCode = `<div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
  <div 
    className="flex flex-col items-center p-2 sm:p-4 bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md origin-center transition-transform duration-300 pointer-events-auto"
    style={{ transform: \`scale(\${scaleFactor})\` }}
  >`;

code = code.replace(regex, newCode);

const regex2 = /<\/div>\s*\{\/\* Bottom Buttons Fixed \*\/\}/;
const newCode2 = `</div>\n</div>\n  {/* Bottom Buttons Fixed */}`;
code = code.replace(regex2, newCode2);

fs.writeFileSync('src/GameEngine.tsx', code);
