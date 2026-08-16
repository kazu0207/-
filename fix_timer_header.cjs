const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  /<div className="relative z-10 text-lg font-black text-amber-400 leading-none">\{p\.score\}<\/div>/,
  `<div className="relative z-10 text-lg font-black text-amber-400 leading-none">{p.score}</div>
              {gameState.currentPlayerIndex === idx && (
                <div className={cn("relative z-10 ml-1 text-sm font-bold", gameState.timeLeft <= 3 ? "text-rose-400 animate-pulse" : "text-cyan-400")}>
                  {gameState.timeLeft}s
                </div>
              )}`
);

fs.writeFileSync('src/GameEngine.tsx', code);
