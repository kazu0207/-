const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Add activeActionCard to CPU gravity
code = code.replace(
  /comboOwnerIndex: currentState\.currentPlayerIndex,\s*lastAction: undefined\s*\}\);/m,
  `comboOwnerIndex: currentState.currentPlayerIndex,
            lastAction: undefined,
            activeActionCard: { type: 'gravity', playerName: currentActivePlayer.name }
          });`
);

// Add activeActionCard to CPU tornado
code = code.replace(
  /const newState = \{ \.\.\.currentState, players: newPlayers, deck: newDeck \};\s*endTurn\(newState, updateState\);/m,
  `const newState = { ...currentState, players: newPlayers, deck: newDeck, activeActionCard: { type: 'tornado', playerName: currentActivePlayer.name } as any };
          endTurn(newState, updateState);`
);

// Add activeActionCard to Local gravity
code = code.replace(
  /comboOwnerIndex: gameState\.currentPlayerIndex,\s*lastAction: undefined\s*\}\);\s*setSelectedCardIdx\(null\);/m,
  `comboOwnerIndex: gameState.currentPlayerIndex,
        lastAction: undefined,
        activeActionCard: { type: 'gravity', playerName: activePlayer.name }
      });
      setSelectedCardIdx(null);`
);

// Add activeActionCard to Local tornado
code = code.replace(
  /const newState = \{\s*\.\.\.gameState,\s*players: newPlayers,\s*deck: newDeck\s*\};\s*endTurn\(newState, updateState\);\s*setSelectedCardIdx\(null\);/m,
  `const newState = {
        ...gameState,
        players: newPlayers,
        deck: newDeck,
        activeActionCard: { type: 'tornado', playerName: activePlayer.name } as any
      };
      endTurn(newState, updateState);
      setSelectedCardIdx(null);`
);

// endTurn clear
code = code.replace(
  /turnGainedPoints: 0,\s*timeLeft: 10\s*\}\);\s*setSelectedCardIdx\(null\);\s*\}/m,
  `turnGainedPoints: 0,
      timeLeft: 10,
      activeActionCard: undefined
    });
    setSelectedCardIdx(null);
  }`
);

fs.writeFileSync('src/GameEngine.tsx', code);
