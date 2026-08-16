const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Fix 1: animating_gravity should ALWAYS call endTurn when there are no matches.
// We remove the if (gameState.comboOwnerIndex !== undefined) logic.
code = code.replace(
  /\} else \{\s*if \(gameState\.comboOwnerIndex !== undefined\) \{\s*updateState\(\{\s*\.\.\.gameState,\s*status: 'playing',\s*comboCount: 0,\s*pendingPoints: 0,\s*turnGainedPoints: 0\s*\}\);\s*\} else \{\s*endTurn\(gameState, updateState\);\s*\}\s*\}/,
  `} else {
          endTurn(gameState, updateState);
        }`
);

// Fix 2: CPU Turn Logic should not draw cards or advance the turn.
const oldCpuDraw = /if \(newPlayers\[currentState\.currentPlayerIndex\]\.hand\.length < 4[\s\S]*?const nextIndex = \(currentState\.currentPlayerIndex \+ 1\) % currentState\.players\.length;/;
code = code.replace(oldCpuDraw, "");

const oldCpuUpdate = /updateState\(\{[\s\S]*?status: 'animating_gravity',[\s\S]*?currentPlayerIndex: nextIndex,[\s\S]*?timeLeft: 10\s*\}\);/;
const newCpuUpdate = `updateState({
        ...currentState,
        players: newPlayers,
        columns: newColumns,
        lastAction: { col: randomCol, type: randomType as 'top' | 'bottom' },
        status: 'animating_gravity',
        comboCount: 0,
        comboOwnerIndex: currentState.currentPlayerIndex
      });`;
code = code.replace(oldCpuUpdate, newCpuUpdate);

// Fix 3: handleColumnClick should not draw cards or advance the turn.
const oldLocalDraw = /\/\/ Draw immediately\s*if \(newPlayers\[gameState\.currentPlayerIndex\]\.hand\.length < 4[\s\S]*?const nextIndex = \(gameState\.currentPlayerIndex \+ 1\) % gameState\.players\.length;/;
code = code.replace(oldLocalDraw, "");

const oldLocalUpdate = /updateState\(\{[\s\S]*?status: 'animating_gravity',[\s\S]*?currentPlayerIndex: nextIndex,[\s\S]*?timeLeft: 10\s*\}\);\s*setSelectedCardIdx\(null\);/;
const newLocalUpdate = `updateState({
      ...gameState,
      players: newPlayers,
      columns: newColumns,
      lastAction: { col: colIdx, type: actionType },
      status: 'animating_gravity',
      comboCount: 0,
      comboOwnerIndex: gameState.currentPlayerIndex
    });
    setSelectedCardIdx(null);`;
code = code.replace(oldLocalUpdate, newLocalUpdate);

fs.writeFileSync('src/GameEngine.tsx', code);
