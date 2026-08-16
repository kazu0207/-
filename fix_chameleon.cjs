const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. TCGCard の呼び出しを修正
const oldRender = /<TCGCard\s+card=\{card\}\s+selected=\{selectedCardIdx === i\}\s+onClick=\{\(\) => \{\s+if \(isActiveLocal && gameState\.status === 'playing'\) \{\s+setSelectedCardIdx\(selectedCardIdx === i \? null : i\); setChameleonColor\(null\);\s+\}\s+\}\}\s+\/>/m;

const newRender = `<TCGCard 
                      card={selectedCardIdx === i && card.color === 'chameleon' && chameleonColor ? { ...card, color: chameleonColor } : card}
                      selected={selectedCardIdx === i}
                      onClick={() => {
                        if (isActiveLocal && gameState.status === 'playing') {
                          setSelectedCardIdx(selectedCardIdx === i ? null : i); setChameleonColor(null);
                        }
                      }}
                    />
                    {selectedCardIdx === i && card.color === 'chameleon' && (
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
                    )}`;

code = code.replace(oldRender, newRender);


// 2. handleColumnClick の先頭を修正して、色が未選択の場合はランダムにする
const oldHandleColumnClick = /const cardToPlay = \{ \.\.\.hand\[selectedCardIdx\], entry: actionType, chameleonColor: chameleonColor \|\| undefined \};/;

const newHandleColumnClick = `const isChameleon = hand[selectedCardIdx].color === 'chameleon';
    let chosenColor = chameleonColor;
    if (isChameleon && !chosenColor) {
      const cols = ['red', 'blue', 'green', 'yellow'];
      chosenColor = cols[Math.floor(Math.random() * cols.length)] as any;
    }
    const cardToPlay = { ...hand[selectedCardIdx], entry: actionType, chameleonColor: chosenColor || undefined };`;

code = code.replace(oldHandleColumnClick, newHandleColumnClick);

fs.writeFileSync('src/GameEngine.tsx', code);
