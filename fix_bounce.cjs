const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const columnAnimRegex = /const isFromTop = \(gameState\.gravity === 'normal' && type === 'top'\) \|\| \(gameState\.gravity === 'reverse' && type === 'bottom'\);/;
const newColumnAnim = `const isFromTop = type === 'top';`;

code = code.replace(columnAnimRegex, newColumnAnim);

fs.writeFileSync('src/GameEngine.tsx', code);
