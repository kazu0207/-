const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const target = `<header className="p-2 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800 shrink-0 relative z-10">
        {/* Player Info */}
        <div className="flex flex-1 items-center justify-start gap-2 overflow-x-auto custom-scrollbar pb-1 -mb-1">
          {gameState.players.map((p, idx) => (
            <div 
              key={p.id} 
              className={cn(
                "px-3 py-1.5 rounded-xl border transition-all relative overflow-hidden flex items-center gap-3 shrink-0",
                gameState.currentPlayerIndex === idx 
                  ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                  : "bg-slate-900/50 border-slate-800 opacity-70"
              )}
            >
              {gameState.currentPlayerIndex === idx && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
              )}
              <div className="relative z-10 flex flex-col items-start">
                <div className="font-bold text-xs text-white truncate max-w-[80px]">
                  {p.isCpu ? '🤖 ' : ''}{p.name}
                </div>
              </div>
              <div className="relative z-10 text-lg font-black text-amber-400 leading-none">{p.score}</div>
              {gameState.currentPlayerIndex === idx && (
                <div className={cn("relative z-10 ml-1 text-sm font-bold", gameState.timeLeft <= 3 ? "text-rose-400 animate-pulse" : "text-cyan-400")}>
                  {gameState.timeLeft}s
                </div>
              )}
            </div>
          ))}
        </div>
      </header>`;

const replacement = `<header className="p-2 flex w-full items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800 shrink-0 relative z-10">
        {/* Player Info */}
        <div className="flex w-full items-center justify-between gap-1 sm:gap-2">
          {gameState.players.map((p, idx) => (
            <div 
              key={p.id} 
              className={cn(
                "px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg border transition-all relative overflow-hidden flex flex-col justify-center flex-1 min-w-0",
                gameState.currentPlayerIndex === idx 
                  ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                  : "bg-slate-900/50 border-slate-800 opacity-70"
              )}
            >
              {gameState.currentPlayerIndex === idx && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
              )}
              {/* Top Row: Name & Timer */}
              <div className="relative z-10 flex justify-between items-center w-full gap-1 mb-0.5">
                <div className="font-bold text-[9px] sm:text-[10px] text-white truncate">
                  {p.isCpu ? '🤖' : ''}{p.name}
                </div>
                <div className={cn("text-[9px] sm:text-[10px] font-bold shrink-0", 
                  gameState.currentPlayerIndex === idx 
                    ? (gameState.timeLeft <= 3 ? "text-rose-400 animate-pulse" : "text-cyan-400")
                    : "text-transparent"
                )}>
                  {gameState.currentPlayerIndex === idx ? \`\${gameState.timeLeft}s\` : '0s'}
                </div>
              </div>
              {/* Bottom Row: Score */}
              <div className="relative z-10 text-xs sm:text-sm font-black text-amber-400 leading-none truncate">
                {p.score} <span className="text-[8px] text-amber-400/70 font-normal">pts</span>
              </div>
            </div>
          ))}
        </div>
      </header>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/GameEngine.tsx', code);
  console.log('Patched successfully');
} else {
  console.log('Target not found');
}
