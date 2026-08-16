const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `function recordSpecialCardUse(players, playerIndex, card) {
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
}`,
  `function recordSpecialCardUse(players, playerIndex, card) {
  if (!['gravity', 'tornado', 'chameleon', 'ojama'].includes(card.color)) return players;
  const newPlayers = [...players];
  const defaultStats = { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
  const stats = newPlayers[playerIndex].stats ? { ...newPlayers[playerIndex].stats } : defaultStats;
  stats.specialCardsUsed = { ...stats.specialCardsUsed };
  stats.specialCardsUsed.total++;
  if (card.color === 'gravity') stats.specialCardsUsed.gravity++;
  if (card.color === 'tornado') stats.specialCardsUsed.tornado++;
  if (card.color === 'chameleon') stats.specialCardsUsed.chameleon++;
  if (card.color === 'ojama') stats.specialCardsUsed.ojama++;
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], stats };
  return newPlayers;
}`
);

// Also the match handler:
code = code.replace(
  `let stats = { ...newPlayers[ownerIdx].stats };`,
  `const defaultStats = { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
          let stats = newPlayers[ownerIdx].stats ? { ...newPlayers[ownerIdx].stats } : defaultStats;`
);

fs.writeFileSync('src/GameEngine.tsx', code);
