const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Replace the root wrapper of GameEngine
const rootRegex = /<div className="flex flex-col h-\[100dvh\] bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500\/30 overflow-hidden relative">/;
const newRoot = `<div className="flex items-center justify-center h-[100dvh] w-full bg-black overflow-hidden relative">
      <div 
        className="flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative shadow-2xl ring-1 ring-white/10"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'calc(100dvh * 9 / 16)',
          maxHeight: 'calc(100vw * 16 / 9)',
          aspectRatio: '9 / 16'
        }}
      >`;

code = code.replace(rootRegex, newRoot);

// And we need to add the closing div at the end
const endRegex = /<\/div>\n\s*\);\n\}/;
const newEnd = `</div>\n    </div>\n  );\n}`;
code = code.replace(endRegex, newEnd);

fs.writeFileSync('src/GameEngine.tsx', code);
