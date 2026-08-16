const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. Update initialAnim
const initialAnimRegex = /let initialAnim: any = \{ opacity: 0, scale: 0\.5, y: 0 \};\s*if \(card\.entry === 'bottom'\) \{\s*initialAnim = \{ opacity: 0, y: 150, scale: 0\.8 \};\s*\} else if \(card\.entry === 'top'\) \{\s*initialAnim = \{ opacity: 0, y: -150, scale: 0\.8 \};\s*\}/;
const newInitialAnim = `let initialAnim: any = { opacity: 0, scale: 0.5, y: 0 };
  if (card.entry === 'bottom') {
    initialAnim = { opacity: 0, y: 500, scale: 0.8 };
  } else if (card.entry === 'top') {
    initialAnim = { opacity: 0, y: -500, scale: 0.8 };
  }`;
code = code.replace(initialAnimRegex, newInitialAnim);

// 2. Change layoutId to prevent morphing from hand
code = code.replace(/layoutId={card.id}/g, (match, offset) => {
  // Only replace in PuyoBlock, not TCGCard
  // We can look at the surrounding context, but simpler to replace the second instance
  // or just replace layoutId={card.id} in PuyoBlock.
  return match; // We'll do this safely below
});

const puyoBlockComponentIndex = code.indexOf('export function PuyoBlock');
if (puyoBlockComponentIndex !== -1) {
    const before = code.substring(0, puyoBlockComponentIndex);
    const after = code.substring(puyoBlockComponentIndex);
    const newAfter = after.replace(/layoutId=\{card\.id\}/, 'layoutId={`puyo-${card.id}`}');
    code = before + newAfter;
}

// 3. Update PuyoBlock animate
const puyoBlockAnimateRegex = /animate=\{\s*isMatched\s*\?\s*\{\s*opacity: \[1, 0\.2, 1, 0\],\s*scale: \[1, 0\.8, 1\.3, 1\.6\],\s*filter: \['brightness\(1\)', 'brightness\(3\)', 'brightness\(1\)', 'brightness\(2\)'\]\s*\}\s*:\s*\{\s*opacity: 1,\s*scale: 1,\s*y: selected \? -10 : 0,\s*\}\s*\}/;
const newPuyoBlockAnimate = `animate={
        isMatched 
          ? { 
              opacity: [1, 0, 1, 0, 1, 1, 0], 
              scale: [1, 1, 1, 1, 1, 1.3, 1.6], 
              filter: ['brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(1)', 'brightness(2)']
            }
          : { 
              opacity: 1, 
              scale: 1,
              y: selected ? -10 : 0,
            }
      }`;
code = code.replace(puyoBlockAnimateRegex, newPuyoBlockAnimate);

// 4. Update PuyoBlock transition
const puyoBlockTransitionRegex = /transition=\{\s*isMatched\s*\?\s*\{ duration: 0\.5, times: \[0, 0\.3, 0\.6, 1\], ease: "easeOut" \}\s*:\s*\{ duration: 0\.5, type: "spring", stiffness: 300, damping: 15, mass: 1 \}\s*\}/;
const newPuyoBlockTransition = `transition={
        isMatched
          ? { duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeInOut" }
          : { duration: 0.5, type: "spring", stiffness: 400, damping: 12, mass: 1 }
      }`;
code = code.replace(puyoBlockTransitionRegex, newPuyoBlockTransition);

fs.writeFileSync('src/GameEngine.tsx', code);
