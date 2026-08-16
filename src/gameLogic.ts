import { GameCard, CardColor } from './types';

export const NORMAL_COLORS: CardColor[] = ['red', 'blue', 'green', 'yellow'];
export const ACTION_COLORS: CardColor[] = ['ojama', 'chameleon', 'gravity', 'tornado'];

export function createDeck(prefix: string = '1', numPlayers: number = 2): GameCard[] {
  const deck: GameCard[] = [];
  let idCounter = 0;
  
  let normalCount = 15;
  let actionCount = 5;
  
  if (numPlayers === 3) {
    normalCount = 24;
    actionCount = 8;
  } else if (numPlayers >= 4) {
    normalCount = 30;
    actionCount = 10;
  }

  // Normal colors
  for (const color of NORMAL_COLORS) {
    for (let i = 0; i < normalCount; i++) {
      deck.push({ id: `card-${prefix}-${color}-${idCounter++}`, color });
    }
  }
  
  // Action cards
  for (const color of ACTION_COLORS) {
    for (let i = 0; i < actionCount; i++) {
      deck.push({ id: `card-${prefix}-${color}-${idCounter++}`, color });
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function findMatches(columns: GameCard[][]): { matchedIds: string[], linesCount: number } {
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
}
