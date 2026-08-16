const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `let newPlayers = [...gameState.players];`,
  `let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);`
);

fs.writeFileSync('src/GameEngine.tsx', code);
