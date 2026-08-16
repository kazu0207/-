const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const target = \`      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const randomType = Math.random() > 0.5 ? 'top' : 'bottom';
      
      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon') {
          const cols = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }\`;

const replacement = \`      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon' && chosenChameleonColor) {
         cardToPlay.chameleonColor = chosenChameleonColor;
      } else if (cardToPlay.color === 'chameleon') {
         const cols = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }\`;

code = code.replace(target, replacement);

fs.writeFileSync('src/GameEngine.tsx', code);
