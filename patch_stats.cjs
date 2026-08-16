const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Helper to inject stats increment
function replaceCode(findStr, replaceStr) {
  code = code.replace(findStr, replaceStr);
}

// 1. Matches (in animating_gravity)
replaceCode(
  `const combo = gameState.comboCount + 1;`,
  `const combo = gameState.comboCount + 1;
          const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;
          let newPlayers = [...gameState.players];
          let stats = { ...newPlayers[ownerIdx].stats };
          
          stats.maxCombo = Math.max(stats.maxCombo, combo);
          stats.linesCleared += linesCount;
          stats.maxSimultaneousLines = Math.max(stats.maxSimultaneousLines, linesCount);
          
          const matchedBlocks = gameState.columns.flat().filter(c => matchedIds.includes(c.id));
          stats.blocksCleared = { ...stats.blocksCleared };
          matchedBlocks.forEach(b => {
            stats.blocksCleared.total++;
            const col = b.color === 'chameleon' ? (b.chameleonColor || 'chameleon') : b.color;
            if (col === 'red') stats.blocksCleared.red++;
            else if (col === 'blue') stats.blocksCleared.blue++;
            else if (col === 'green') stats.blocksCleared.green++;
            else if (col === 'yellow') stats.blocksCleared.yellow++;
            else if (col === 'ojama') stats.blocksCleared.ojama++;
          });
          
          newPlayers[ownerIdx] = { ...newPlayers[ownerIdx], stats };`
);

replaceCode(
  `turnGainedPointsPlayerName: gameState.players[gameState.comboOwnerIndex ?? gameState.currentPlayerIndex].name`,
  `turnGainedPointsPlayerName: gameState.players[gameState.comboOwnerIndex ?? gameState.currentPlayerIndex].name, players: newPlayers`
);

// We need a helper to log special card usage
const specialCardHelper = `
function recordSpecialCardUse(players, playerIndex, card) {
  if (!['gravity', 'tornado', 'chameleon', 'ojama'].includes(card.color)) return players;
  const newPlayers = [...players];
  const stats = { ...newPlayers[playerIndex].stats };
  stats.specialCardsUsed = { ...stats.specialCardsUsed };
  stats.specialCardsUsed.total++;
  if (card.color === 'gravity') stats.specialCardsUsed.gravity++;
  if (card.color === 'tornado') stats.specialCardsUsed.tornado++;
  if (card.color === 'chameleon') stats.specialCardsUsed.chameleon++;
  if (card.color === 'ojama') stats.specialCardsUsed.ojama++;
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], stats };
  return newPlayers;
}
`;

// Insert helper before GameEngine
const gameEngineIdx = code.indexOf('export function GameEngine');
code = code.slice(0, gameEngineIdx) + specialCardHelper + code.slice(gameEngineIdx);

// Apply in CPU turn
// For Gravity / Tornado
replaceCode(
  `let newPlayers = [...currentState.players];`,
  `let newPlayers = [...currentState.players];
      newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);`
);

// Wait, the above CPU action card logic is:
replaceCode(
  `const cardToPlayBase = hand.splice(cardToPlayIdx, 1)[0];`,
  `const cardToPlayBase = hand.splice(cardToPlayIdx, 1)[0];`
); // wait let's just make sure

fs.writeFileSync('src/GameEngine.tsx', code);
