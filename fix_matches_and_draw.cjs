const fs = require('fs');

// 1. Fix gameLogic.ts with Flood Fill
let logic = fs.readFileSync('src/gameLogic.ts', 'utf8');

const floodFillCode = `export function findMatches(columns: GameCard[][]): { matchedIds: string[], linesCount: number } {
  const matchedIds = new Set<string>();
  let linesCount = 0;
  
  const visited = new Set<string>();

  for (let c = 0; c < columns.length; c++) {
    for (let r = 0; r < columns[c].length; r++) {
      const card = columns[c][r];
      if (visited.has(card.id)) continue;
      
      const color = card.chameleonColor || card.color;
      if (color === 'ojama' || color === 'gravity' || color === 'tornado' || color === 'chameleon') {
        continue;
      }

      // Flood fill
      const component: GameCard[] = [];
      const queue = [{c, r}];
      visited.add(card.id);

      while (queue.length > 0) {
        const curr = queue.shift();
        const currCard = columns[curr.c][curr.r];
        component.push(currCard);

        const neighbors = [
          { c: curr.c, r: curr.r - 1 },
          { c: curr.c, r: curr.r + 1 },
          { c: curr.c - 1, r: curr.r },
          { c: curr.c + 1, r: curr.r }
        ];

        for (const n of neighbors) {
          const nCard = columns[n.c]?.[n.r];
          if (nCard && !visited.has(nCard.id)) {
            const nColor = nCard.chameleonColor || nCard.color;
            if (nColor === color) {
              visited.add(nCard.id);
              queue.push(n);
            }
          }
        }
      }

      if (component.length >= 3) {
        linesCount++;
        for (const compCard of component) {
          matchedIds.add(compCard.id);
        }
      }
    }
  }

  // Handle Ojama cards (disappear if adjacent to matched cards)
  if (matchedIds.size > 0) {
    const ojamaToKill = new Set<string>();
    for (let c = 0; c < columns.length; c++) {
      for (let r = 0; r < columns[c].length; r++) {
        const card = columns[c][r];
        if (card.color === 'ojama' && !matchedIds.has(card.id)) {
          // Check neighbors
          const neighbors = [
            columns[c][r-1], // bottom
            columns[c][r+1], // top
            columns[c-1]?.[r], // left
            columns[c+1]?.[r]  // right
          ];
          for (const n of neighbors) {
            if (n && matchedIds.has(n.id)) {
              ojamaToKill.add(card.id);
              break;
            }
          }
        }
      }
    }
    for (const id of ojamaToKill) {
      matchedIds.add(id);
    }
  }

  return { matchedIds: Array.from(matchedIds), linesCount };
}`;

logic = logic.replace(/export function findMatches\([\s\S]*?linesCount \};\n\}/, floodFillCode);
fs.writeFileSync('src/gameLogic.ts', logic);

// 2. Fix endTurn in GameEngine.ts to draw at the end of YOUR turn
let engine = fs.readFileSync('src/GameEngine.tsx', 'utf8');
engine = engine.replace(
  /if \(newPlayers\[nextIndex\]\.hand\.length < 4 && newDeck\.length > 0\) \{\s*const card = newDeck\.pop\(\);\s*if \(card\) \{\s*newPlayers\[nextIndex\] = \{ \.\.\.newPlayers\[nextIndex\], hand: \[\.\.\.newPlayers\[nextIndex\]\.hand, card\] \};\s*\}\s*\}/,
  `if (newPlayers[state.currentPlayerIndex].hand.length < 4 && newDeck.length > 0) {
      const card = newDeck.pop();
      if (card) {
        newPlayers[state.currentPlayerIndex] = { ...newPlayers[state.currentPlayerIndex], hand: [...newPlayers[state.currentPlayerIndex].hand, card] };
      }
    }`
);
fs.writeFileSync('src/GameEngine.tsx', engine);
