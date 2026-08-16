const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `let newDeck = [...gameState.deck];`,
  `let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);`
);

code = code.replace(
  `const newHand = [...hand];
    newHand.splice(selectedCardIdx, 1);
    
    const newActivePlayer = { ...activePlayer, hand: newHand };
    const newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayerIndex] = newActivePlayer;`,
  `const newHand = [...hand];
    newHand.splice(selectedCardIdx, 1);
    
    const newActivePlayer = { ...newPlayers[gameState.currentPlayerIndex], hand: newHand };
    newPlayers[gameState.currentPlayerIndex] = newActivePlayer;`
);

fs.writeFileSync('src/GameEngine.tsx', code);
