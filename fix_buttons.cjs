const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const scaledContainerStart = /<div\s*className="flex flex-col items-center p-2 sm:p-4 bg-slate-900\/60 rounded-2xl shadow-2xl border border-slate-700\/50 backdrop-blur-md origin-bottom transition-transform duration-300"\s*style=\{\{ transform: \`scale\(\$\{scaleFactor\}\)\` \}\}\s*>/m;
const topBtns = `{/* Top Buttons inside scaled container */}
              <div className="flex justify-center gap-0 w-full mb-2 shrink-0 z-20">
                {gameState.columns.map((col, colIdx) => (
                  <div key={\`top-btn-\${colIdx}\`} className="flex justify-center w-[64px]">
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
              </div>`;
              
const botBtns = `{/* Bottom Buttons inside scaled container */}
              <div className="flex justify-center gap-0 w-full mt-2 shrink-0 z-20">
                {gameState.columns.map((col, colIdx) => (
                  <div key={\`bottom-btn-\${colIdx}\`} className="flex justify-center w-[64px]">
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
              </div>`;

// Check if these strings are exact or if we can use regex.
// Since whitespace might differ, regex is safer.
code = code.replace(/\{\/\* Top Buttons inside scaled container \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="flex justify-center gap-0 flex-1/m, 
  `<div className="flex justify-center gap-0 flex-1`);

code = code.replace(/\{\/\* Bottom Buttons inside scaled container \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Right Panel/m,
  `</div>
            </div>
          </div>
        </div>
        {/* Right Panel`);

// Now insert them OUTSIDE the scaled div, but INSIDE the boardRef div
// boardRef div: <div ref={boardRef} className="flex-1 flex flex-col justify-end items-center w-full min-h-0 relative">
code = code.replace(/<div ref=\{boardRef\} className="flex-1 flex flex-col justify-end items-center w-full min-h-0 relative">\s*<div/m,
  `<div ref={boardRef} className="flex-1 flex flex-col justify-end items-center w-full min-h-0 relative">
            {/* Top Buttons Fixed */}
            <div className="flex justify-center gap-0 w-full mb-2 shrink-0 z-20 absolute top-4 left-0 right-0">
              <div className="flex justify-center gap-0" style={{ width: '192px', margin: '0 auto' }}>
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
            
            <div `);

code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Right Panel: Hand \*\/}/m,
  `</div>
            </div>
            {/* Bottom Buttons Fixed */}
            <div className="flex justify-center gap-0 w-full mt-2 shrink-0 z-20 absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-0" style={{ width: '192px', margin: '0 auto' }}>
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
        {/* Right Panel: Hand */}`);

fs.writeFileSync('src/GameEngine.tsx', code);
