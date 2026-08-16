const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const target = `isActiveLocal && gameState.status === 'playing' ? "bg-indigo-900/20 border-l-indigo-500/50" : "bg-slate-900/20 border-l-slate-800/50"`;
const repl = `isActiveLocal && gameState.status === 'playing' ? "bg-indigo-700/50 border-l-cyan-400 shadow-[inset_15px_0_30px_-15px_rgba(34,211,238,0.4)]" : "bg-slate-900/20 border-l-slate-800/50"`;

code = code.replace(target, repl);

fs.writeFileSync('src/GameEngine.tsx', code);
