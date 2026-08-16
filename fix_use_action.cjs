const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. handleColumnClickで特殊カードを防ぐ
const colClickRegex = /const hand = activePlayer\.hand;\s*const isChameleon = hand\[selectedCardIdx\]\.color === 'chameleon';/;
const newColClick = `const hand = activePlayer.hand;
    if (hand[selectedCardIdx].color === 'gravity' || hand[selectedCardIdx].color === 'tornado') return;
    const isChameleon = hand[selectedCardIdx].color === 'chameleon';`;
code = code.replace(colClickRegex, newColClick);

// 2. 「使用する」ボタンを追加
const chameleonRenderRegex = /\{selectedCardIdx === i && card\.color === 'chameleon' && \([\s\S]*?<\/div>\s*\)\}/;
const newChameleonRender = `{selectedCardIdx === i && card.color === 'chameleon' && (
                      <div className="flex gap-1 bg-slate-900/80 p-1.5 rounded-full absolute -right-12 top-1/2 -translate-y-1/2 flex-col z-50">
                        {(['red', 'blue', 'green', 'yellow'] as const).map(c => (
                           <div 
                             key={c}
                             className={\`w-6 h-6 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 \${chameleonColor === c ? 'border-white' : 'border-transparent'}\`}
                             style={{ backgroundColor: c === 'red' ? '#e11d48' : c === 'blue' ? '#0891b2' : c === 'green' ? '#059669' : '#d97706' }}
                             onClick={(e) => { e.stopPropagation(); setChameleonColor(c); }}
                           />
                        ))}
                      </div>
                    )}
                    {selectedCardIdx === i && (card.color === 'gravity' || card.color === 'tornado') && (
                      <div className="flex gap-1 bg-slate-900/80 p-2 rounded-lg absolute -right-24 top-1/2 -translate-y-1/2 flex-col z-50">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleActionCardUse(card.color); }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded shadow-lg whitespace-nowrap"
                        >
                          使用する
                        </button>
                      </div>
                    )}`;
code = code.replace(chameleonRenderRegex, newChameleonRender);

fs.writeFileSync('src/GameEngine.tsx', code);
