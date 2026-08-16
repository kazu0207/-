const fs = require('fs');
let code = fs.readFileSync('src/gameLogic.ts', 'utf8');

const newFindMatches = `export function findMatches(columns: GameCard[][]): { matchedIds: string[], linesCount: number } {
  const matchedIds = new Set<string>();
  let linesCount = 0;

  // Vertical matches
  for (let c = 0; c < columns.length; c++) {
    const col = columns[c];
    let r = 0;
    while (r < col.length) {
      let color = col[r].chameleonColor || col[r].color;
      if (color === 'ojama' || color === 'gravity' || color === 'tornado' || color === 'chameleon') {
        r++;
        continue;
      }
      let count = 1;
      let nextR = r + 1;
      while (nextR < col.length) {
        let nextColor = col[nextR].chameleonColor || col[nextR].color;
        if (nextColor === color) {
          count++;
          nextR++;
        } else {
          break;
        }
      }
      if (count >= 3) {
        linesCount++;
        for (let i = r; i < nextR; i++) {
          matchedIds.add(col[i].id);
        }
      }
      r = nextR;
    }
  }

  // Horizontal matches
  const maxRows = Math.max(0, ...columns.map(c => c.length));
  for (let r = 0; r < maxRows; r++) {
    let c = 0;
    while (c < columns.length) {
      if (!columns[c][r]) {
        c++;
        continue;
      }
      let color = columns[c][r].chameleonColor || columns[c][r].color;
      if (color === 'ojama' || color === 'gravity' || color === 'tornado' || color === 'chameleon') {
        c++;
        continue;
      }
      let count = 1;
      let nextC = c + 1;
      while (nextC < columns.length && columns[nextC][r]) {
        let nextColor = columns[nextC][r].chameleonColor || columns[nextC][r].color;
        if (nextColor === color) {
          count++;
          nextC++;
        } else {
          break;
        }
      }
      if (count >= 3) {
        linesCount++;
        for (let i = c; i < nextC; i++) {
          matchedIds.add(columns[i][r].id);
        }
      }
      c = nextC;
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

// replace from export function findMatches to the end
code = code.substring(0, code.indexOf('export function findMatches')) + newFindMatches + "\n";
fs.writeFileSync('src/gameLogic.ts', code);
