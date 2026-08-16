const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `        let newPlayers = [...currentState.players];
      newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);
        let newDeck = [...currentState.deck];
      let newPlayers = [...currentState.players];
      newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);`,
  `        let newPlayers = [...currentState.players];
        newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);
        let newDeck = [...currentState.deck];`
);

code = code.replace(
  `    let newPlayers = [...gameState.players];
    let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);`,
  `    let newPlayers = [...gameState.players];
    newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);
    let newDeck = [...gameState.deck];`
);

fs.writeFileSync('src/GameEngine.tsx', code);
