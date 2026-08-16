const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const puyoBlockTransitionRegex = /:\s*\{\s*type: "spring", stiffness: 300, damping: 15, mass: 1\s*\}/;
const newPuyoBlockTransition = `: { type: "spring", bounce: 0.5, duration: 0.6 }`;
code = code.replace(puyoBlockTransitionRegex, newPuyoBlockTransition);

// Also we need to make the column bounce faster so it syncs with the drop
const columnAnimRegex = /isGravityDrop \? \{ scaleY: \[1, 0\.85, 1\.05, 1\], y: 0 \} : \{ scaleY: 1, y: 0 \}/;
const newColumnAnim = `isGravityDrop ? { scaleY: [1, 0.9, 1.02, 1], y: 0 } : { scaleY: 1, y: 0 }`;
code = code.replace(columnAnimRegex, newColumnAnim);

const columnTransitionRegex = /gameState\.lastAction\?\.col === colIdx \? \{ duration: 0\.4, times: \[0, 0\.4, 0\.7, 1\] \}/;
const newColumnTransition = `gameState.lastAction?.col === colIdx ? { duration: 0.5, times: [0, 0.2, 0.5, 1], ease: "easeInOut" }`;
code = code.replace(columnTransitionRegex, newColumnTransition);


fs.writeFileSync('src/GameEngine.tsx', code);
