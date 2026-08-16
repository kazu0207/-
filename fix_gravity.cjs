const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// CPU gravity
const cpuRegex = /if \(cardToPlayBase\.color === 'gravity'\) \{\s*newPlayers\[currentState\.currentPlayerIndex\] = \{\s*\.\.\.currentActivePlayer,\s*hand: hand\.filter\(\(_, i\) => i !== randomCardIdx\)\s*\};\s*updateState\(\{/;
const cpuNew = `if (cardToPlayBase.color === 'gravity') {
          newPlayers[currentState.currentPlayerIndex] = {
            ...currentActivePlayer,
            hand: hand.filter((_, i) => i !== randomCardIdx)
          };
          const newColumns = currentState.columns.map(col => [...col].reverse());
          updateState({
            columns: newColumns,`;
code = code.replace(cpuRegex, cpuNew);

// Player gravity
const pRegex = /if \(action === 'gravity'\) \{\s*newPlayers\[gameState\.currentPlayerIndex\] = \{\s*\.\.\.activePlayer,\s*hand: hand\.filter\(\(_, i\) => i !== selectedCardIdx\)\s*\};\s*updateState\(\{/;
const pNew = `if (action === 'gravity') {
      newPlayers[gameState.currentPlayerIndex] = {
        ...activePlayer,
        hand: hand.filter((_, i) => i !== selectedCardIdx)
      };
      const newColumns = gameState.columns.map(col => [...col].reverse());
      updateState({
        columns: newColumns,`;
code = code.replace(pRegex, pNew);

fs.writeFileSync('src/GameEngine.tsx', code);
