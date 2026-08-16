const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const overlayUI = `
      {/* Action Card Overlay */}
      <AnimatePresence>
        {gameState.activeActionCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-slate-950/20 backdrop-blur-[2px]"
          >
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(99,102,241,0.5)] text-center flex flex-col items-center">
              <span className="text-6xl mb-4">
                {gameState.activeActionCard.type === 'gravity' ? '🌌' : '🌪️'}
              </span>
              <h2 className="text-3xl font-black text-white mb-2 tracking-widest uppercase drop-shadow-md">
                {gameState.activeActionCard.type === 'gravity' ? 'GRAVITY REVERSE!' : 'TORNADO!'}
              </h2>
              <p className="text-indigo-300 font-bold text-lg">
                {gameState.activeActionCard.playerName} USED ACTION!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;

code = code.replace(
  /<main className="flex-1 grid grid-cols-4 gap-0 w-full max-w-5xl mx-auto min-h-0">/,
  overlayUI + '\n      <main className="flex-1 grid grid-cols-4 gap-0 w-full max-w-5xl mx-auto min-h-0">'
);

fs.writeFileSync('src/GameEngine.tsx', code);
