const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `        let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);
        const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;`,
  `        let newPlayers = [...gameState.players];
        const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;`
);

fs.writeFileSync('src/GameEngine.tsx', code);
