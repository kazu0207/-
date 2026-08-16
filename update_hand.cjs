const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  /<aside className="col-span-1 flex flex-col items-center py-4 px-2 border-l border-slate-800\/50 bg-slate-900\/20">/,
  `<aside className={cn("col-span-1 flex flex-col items-center py-4 px-2 border-l transition-colors duration-500", isActiveLocal && gameState.status === 'playing' ? "bg-indigo-900/20 border-l-indigo-500/50" : "bg-slate-900/20 border-l-slate-800/50")}>`
);

const actionUi = `
                    <TCGCard 
                      card={{...card, chameleonColor: selectedCardIdx === i && card.color === 'chameleon' && chameleonColor ? chameleonColor : undefined}}
                      selected={selectedCardIdx === i}
                      onClick={() => {
                        if (isActiveLocal && gameState.status === 'playing') {
                          setSelectedCardIdx(selectedCardIdx === i ? null : i); setChameleonColor(null);
                        }
                      }}
                    />
                    {selectedCardIdx === i && card.color === 'chameleon' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-[120px] left-1/2 -translate-x-1/2 flex justify-center gap-1 bg-slate-800 p-2 rounded-xl z-50 shadow-xl border border-slate-700"
                      >
                        {['red', 'blue', 'green', 'yellow'].map(c => (
                          <div 
                            key={c}
                            className={cn("w-6 h-6 rounded-full cursor-pointer transition-transform", chameleonColor === c ? 'ring-2 ring-white scale-125' : 'opacity-70 hover:scale-110')}
                            style={{ backgroundColor: c === 'red' ? '#e11d48' : c === 'blue' ? '#0891b2' : c === 'green' ? '#059669' : '#d97706' }}
                            onClick={(e) => { e.stopPropagation(); setChameleonColor(c); }}
                          />
                        ))}
                      </motion.div>
                    )}
                    {selectedCardIdx === i && (card.color === 'gravity' || card.color === 'tornado') && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleActionCardUse(card.color); }}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-lg border border-indigo-400"
                        >
                          使用する
                        </button>
                      </motion.div>
                    )}
`;

code = code.replace(
  /<TCGCard[\s\S]*?setSelectedCardIdx\(selectedCardIdx === i \? null : i\); setChameleonColor\(null\);\s*\}\s*\}\s*\/>/m,
  actionUi
);

fs.writeFileSync('src/GameEngine.tsx', code);
