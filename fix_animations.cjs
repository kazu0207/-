const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. Update PuyoBlock initialAnim
const puyoBlockRegex = /let initialAnim: any = \{ opacity: 0, scale: 1, y: 0 \};\s*if \(card\.entry === 'bottom'\) \{\s*initialAnim = \{ opacity: 0, y: 30 \};\s*\} else if \(card\.entry === 'top'\) \{\s*initialAnim = \{ opacity: 0, y: -30 \};\s*\}/;

const newInitialAnim = `let initialAnim: any = { opacity: 0, scale: 0.5, y: 0 };
  if (card.entry === 'bottom') {
    initialAnim = { opacity: 0, y: 150, scale: 0.8 };
  } else if (card.entry === 'top') {
    initialAnim = { opacity: 0, y: -150, scale: 0.8 };
  }`;

code = code.replace(puyoBlockRegex, newInitialAnim);

// 2. Update PuyoBlock animate and transition
const puyoBlockAnimateRegex = /animate=\{\s*isMatched\s*\?\s*\{ opacity: 0, scale: 0, filter: 'brightness\(2\)' \}\s*:\s*\{\s*opacity: 1,\s*scale: 1,\s*y: selected \? -10 : 0,\s*\}\s*\}/;
const newPuyoBlockAnimate = `animate={
        isMatched 
          ? { 
              opacity: [1, 0.2, 1, 0], 
              scale: [1, 0.8, 1.3, 1.6], 
              filter: ['brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(2)']
            }
          : { 
              opacity: 1, 
              scale: 1,
              y: selected ? -10 : 0,
            }
      }`;
code = code.replace(puyoBlockAnimateRegex, newPuyoBlockAnimate);

const puyoBlockTransitionRegex = /transition=\{\{ duration: 0\.3, type: "spring", bounce: 0\.4 \}\}/;
const newPuyoBlockTransition = `transition={
        isMatched
          ? { duration: 0.5, times: [0, 0.3, 0.6, 1], ease: "easeOut" }
          : { duration: 0.5, type: "spring", stiffness: 300, damping: 15, mass: 1 }
      }`;
code = code.replace(puyoBlockTransitionRegex, newPuyoBlockTransition);

// 3. Update Column animation
const columnAnimRegex = /animate=\{gameState\.lastAction\?\.col === colIdx && gameState\.lastAction\?\.type === 'top' \? \{ y: \[0, 15, -5, 0\] \} : \{ y: 0 \}\}\s*transition=\{gameState\.lastAction\?\.col === colIdx && gameState\.lastAction\?\.type === 'top' \? \{ duration: 0\.4, times: \[0, 0\.4, 0\.7, 1\] \} : \{ type: 'spring', stiffness: 400, damping: 10 \}\}/;
const newColumnAnim = `animate={(() => {
                    if (gameState.lastAction?.col !== colIdx) return { y: 0 };
                    const type = gameState.lastAction.type;
                    const isFromTop = (gameState.gravity === 'normal' && type === 'top') || (gameState.gravity === 'reverse' && type === 'bottom');
                    return isFromTop ? { y: [0, 15, -5, 0] } : { y: [0, -15, 5, 0] };
                  })()}
                  transition={gameState.lastAction?.col === colIdx ? { duration: 0.4, times: [0, 0.4, 0.7, 1] } : { type: 'spring', stiffness: 400, damping: 10 }}`;

code = code.replace(columnAnimRegex, newColumnAnim);

fs.writeFileSync('src/GameEngine.tsx', code);
