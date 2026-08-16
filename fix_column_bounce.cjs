const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const columnAnimRegex = /animate=\{\(\(\) => \{\s*if \(gameState\.lastAction\?\.col !== colIdx\) return \{ y: 0 \};\s*const type = gameState\.lastAction\.type;\s*const isFromTop = type === 'top';\s*return isFromTop \? \{ y: \[0, 15, -5, 0\] \} : \{ y: \[0, -15, 5, 0\] \};\s*\}\)\(\)\}/;

const newColumnAnim = `style={{ transformOrigin: gameState.gravity === 'normal' ? 'bottom' : 'top' }}
                  animate={(() => {
                    if (gameState.lastAction?.col !== colIdx) return { scaleY: 1, y: 0 };
                    const type = gameState.lastAction.type;
                    const isGravityDrop = (gameState.gravity === 'normal' && type === 'top') || (gameState.gravity === 'reverse' && type === 'bottom');
                    return isGravityDrop ? { scaleY: [1, 0.85, 1.05, 1], y: 0 } : { scaleY: 1, y: 0 };
                  })()}`;

code = code.replace(columnAnimRegex, newColumnAnim);

// We need to fix PuyoBlock transition to bounce more for the dropped block
// Currently PuyoBlock transition for normal state is:
// : { duration: 0.5, type: "spring", stiffness: 400, damping: 12, mass: 1 }
// Let's make it bouncier: stiffness 500, damping 15? Or bounce prop?
// If we use type: "spring", bounce: 0.6
const puyoBlockTransitionRegex = /:\s*\{\s*duration: 0\.5,\s*type: "spring",\s*stiffness: 400,\s*damping: 12,\s*mass: 1\s*\}/;
const newPuyoBlockTransition = `: { type: "spring", bounce: 0.6, duration: 0.6 }`;
code = code.replace(puyoBlockTransitionRegex, newPuyoBlockTransition);

fs.writeFileSync('src/GameEngine.tsx', code);
