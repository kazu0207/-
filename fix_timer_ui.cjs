const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  /<div className="text-xs font-bold tracking-widest uppercase mb-6 text-center">[\s\S]*?<\/div>/,
  `<div className="text-xs font-bold tracking-widest uppercase mb-4 text-center">
    {isActiveLocal && gameState.status === 'playing' ? (
      <div className="flex flex-col items-center gap-2">
        <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">あなたの<br/>ターン</span>
        <div className={cn("text-2xl font-black rounded-full w-12 h-12 flex items-center justify-center border-4", gameState.timeLeft <= 3 ? "text-rose-400 border-rose-500 animate-pulse" : "text-cyan-400 border-cyan-500")}>
          {gameState.timeLeft}
        </div>
      </div>
    ) : (
      <span className="text-slate-500">あなたの<br/>手札</span>
    )}
  </div>`
);

fs.writeFileSync('src/GameEngine.tsx', code);
