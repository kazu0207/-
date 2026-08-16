const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /const isConnectedTop = \(gameState\.gravity === 'reverse' \? col\[idx - 1\]\?\.color : col\[idx \+ 1\]\?\.color\) === card\.color;[\s\S]*?const isConnectedRight = gameState\.columns\[colIdx \+ 1\]\?\.\[idx\]\?\.color === card\.color;/;

const newCode = `const isOjama = card.color === 'ojama';
                      const isConnectedTop = !isOjama && (gameState.gravity === 'reverse' ? col[idx - 1]?.color : col[idx + 1]?.color) === card.color;
                      const isConnectedBottom = !isOjama && (gameState.gravity === 'reverse' ? col[idx + 1]?.color : col[idx - 1]?.color) === card.color;
                      const isConnectedLeft = !isOjama && gameState.columns[colIdx - 1]?.[idx]?.color === card.color;
                      const isConnectedRight = !isOjama && gameState.columns[colIdx + 1]?.[idx]?.color === card.color;`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/GameEngine.tsx', code);
