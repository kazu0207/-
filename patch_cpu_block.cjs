const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `let newDeck = [...currentState.deck];`,
  `let newDeck = [...currentState.deck];
      let newPlayers = [...currentState.players];
      newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);`
);

// We need to use `newPlayers` for updating state later.
code = code.replace(
  `const newHand = [...hand];
      newHand.splice(randomCardIdx, 1);
      
      const newActivePlayer = { ...currentActivePlayer, hand: newHand };`,
  `const newHand = [...hand];
      newHand.splice(randomCardIdx, 1);
      
      const newActivePlayer = { ...newPlayers[currentState.currentPlayerIndex], hand: newHand };
      newPlayers[currentState.currentPlayerIndex] = newActivePlayer;`
);

code = code.replace(
  `const newPlayers = [...currentState.players];
      newPlayers[currentState.currentPlayerIndex] = newActivePlayer;`,
  ``
);

fs.writeFileSync('src/GameEngine.tsx', code);
