const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// I need to carefully rip out the old buttons and structure, and insert the new ones.
// From `<div className="flex justify-center gap-0 flex-1 min-h-[300px]">` upwards to ` {/* Top Buttons Fixed */}`
const start1 = code.indexOf(`{/* Top Buttons Fixed */}`);
const end1 = code.indexOf(`<div className="flex justify-center gap-0 flex-1 min-h-[300px]">`);
if (start1 !== -1 && end1 !== -1) {
    code = code.substring(0, start1) + code.substring(end1);
}

// And from `<div ref={boardRef} ` downwards to `<div className="flex justify-center gap-0 flex-1 min-h-[300px]">`
const boardRefIdx = code.indexOf(`<div ref={boardRef}`);
const flex1Idx = code.indexOf(`<div className="flex justify-center gap-0 flex-1 min-h-[300px]">`);
const beforeBoardRef = code.substring(0, boardRefIdx);
const afterFlex1 = code.substring(flex1Idx);

const topBtnsFixed = `
<div ref={boardRef} className="flex-1 flex flex-col justify-end items-center w-full min-h-0 relative py-16">
  {/* Top Buttons Fixed */}
  <div className="flex justify-center gap-0 w-full shrink-0 z-20 absolute top-4 left-0 right-0 pointer-events-none">
    <div className="flex justify-center gap-0 pointer-events-auto" style={{ width: '192px', margin: '0 auto' }}>
      {[0, 1, 2].map((colIdx) => (
        <div key={\`top-btn-fixed-\${colIdx}\`} className="flex justify-center w-[64px]">
          <button
            onClick={() => handleColumnClick(colIdx, 'top')}
            disabled={gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null}
            className={cn(
              "p-2 rounded-xl font-bold text-xs transition-all duration-300 z-50 w-full",
              gameState.status === 'playing' && isActiveLocal && selectedCardIdx !== null
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                : "bg-slate-800/50 text-slate-600 border border-slate-700 cursor-not-allowed"
            )}
            title="上から乗せる"
          >
            ⬇️
          </button>
        </div>
      ))}
    </div>
  </div>

  <div 
    className="flex flex-col items-center p-2 sm:p-4 bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md origin-center transition-transform duration-300"
    style={{ transform: \`scale(\${scaleFactor})\` }}
  >
`;
code = beforeBoardRef + topBtnsFixed + afterFlex1;

// Now for bottom buttons
// Replace from ` {/* Bottom Buttons inside scaled container */}` up to `{/* Right Panel: Hand */}`
const botStart = code.indexOf(`{/* Bottom Buttons inside scaled container */}`);
const botEnd = code.indexOf(`{/* Right Panel: Hand */}`);

const botBtnsFixed = `
    </div>
  </div>
  {/* Bottom Buttons Fixed */}
  <div className="flex justify-center gap-0 w-full shrink-0 z-20 absolute bottom-4 left-0 right-0 pointer-events-none">
    <div className="flex justify-center gap-0 pointer-events-auto" style={{ width: '192px', margin: '0 auto' }}>
      {[0, 1, 2].map((colIdx) => (
        <div key={\`bottom-btn-fixed-\${colIdx}\`} className="flex justify-center w-[64px]">
          <button
            onClick={() => handleColumnClick(colIdx, 'bottom')}
            disabled={gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null}
            className={cn(
              "p-2 rounded-xl font-bold text-xs transition-all duration-300 z-50 w-full",
              gameState.status === 'playing' && isActiveLocal && selectedCardIdx !== null
                ? "bg-amber-500/20 text-amber-300 border border-amber-400 hover:bg-amber-400 hover:text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                : "bg-slate-800/50 text-slate-600 border border-slate-700 cursor-not-allowed"
            )}
            title="下から入れる"
          >
            ⬆️
          </button>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
`;

if (botStart !== -1 && botEnd !== -1) {
  code = code.substring(0, botStart) + botBtnsFixed + code.substring(botEnd);
}

fs.writeFileSync('src/GameEngine.tsx', code);
