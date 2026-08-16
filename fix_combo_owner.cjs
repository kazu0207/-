const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  /function endTurn\(state: GameState, updater: \(s: GameState\) => void\) \{/,
  `function endTurn(state: GameState, updater: (s: GameState) => void) {`
);

code = code.replace(
  /updater\(\{[\s\S]*?timeLeft: 10\s*\}\);/,
  `updater({
      ...state,
      players: newPlayers,
      deck: newDeck,
      currentPlayerIndex: nextIndex,
      comboOwnerIndex: undefined,
      status: 'playing',
      comboCount: 0,
      pendingPoints: 0,
      turnGainedPoints: 0,
      timeLeft: 10
    });`
);
fs.writeFileSync('src/GameEngine.tsx', code);
