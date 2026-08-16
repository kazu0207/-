const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayerIndex] = {
      ...activePlayer,
      hand: hand.filter((_, i) => i !== selectedCardIdx)
    };`,
  `let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);
    newPlayers[gameState.currentPlayerIndex] = {
      ...newPlayers[gameState.currentPlayerIndex],
      hand: hand.filter((_, i) => i !== selectedCardIdx)
    };`
);

fs.writeFileSync('src/GameEngine.tsx', code);
