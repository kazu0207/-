const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const oldLogic = `      const randomCardIdx = Math.floor(Math.random() * hand.length);
      const cardToPlayBase = hand[randomCardIdx];
      
      if (cardToPlayBase.color === 'gravity' || cardToPlayBase.color === 'tornado') {`;

const newLogic = `      // -- NEW AI LOGIC --
      let bestMoves = [];
      let maxScore = -Infinity;

      const evaluateMove = (cardIdx, col, entry, chameleonColor) => {
        let score = 0;
        let simCols = currentState.columns.map(c => [...c]);
        const card = hand[cardIdx];

        if (card.color === 'gravity') {
          simCols = simCols.map(c => [...c].reverse());
          const matches = findMatches(simCols);
          if (matches.matchedIds.length > 0) return 2000 + matches.matchedIds.length * 100;
          return -50;
        }
        if (card.color === 'tornado') {
          return -200;
        }

        const simCard = { ...card, entry };
        if (simCard.color === 'chameleon' && chameleonColor) simCard.chameleonColor = chameleonColor;

        const actualActionType = currentState.gravity === 'reverse' ? (entry === 'top' ? 'bottom' : 'top') : entry;
        if (actualActionType === 'top') {
          simCols[col].push(simCard);
        } else {
          simCols[col].unshift(simCard);
        }

        const matches = findMatches(simCols);
        if (matches.matchedIds.length > 0) {
          score += 1000 + matches.matchedIds.length * 100;
          return score; // Don't care about vulnerability if we can score now!
        }

        // Check vulnerability: Can the NEXT player make a match easily?
        let isVulnerable = false;
        const testColors = ['red', 'blue', 'green', 'yellow'];
        for (let c = 0; c < 3; c++) {
          for (let t of ['top', 'bottom']) {
            const actualTestT = currentState.gravity === 'reverse' ? (t === 'top' ? 'bottom' : 'top') : t;
            for (let color of testColors) {
               let testCols = simCols.map(c2 => [...c2]);
               if (actualTestT === 'top') {
                 testCols[c].push({ id: 'test', color });
               } else {
                 testCols[c].unshift({ id: 'test', color });
               }
               if (findMatches(testCols).matchedIds.length > 0) {
                 isVulnerable = true;
                 break;
               }
            }
            if (isVulnerable) break;
          }
          if (isVulnerable) break;
        }

        if (isVulnerable) {
          score -= 500;
        }
        
        score -= simCols[col].length;
        if (card.color === 'ojama') score += 50;
        
        return score;
      };

      for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (card.color === 'gravity' || card.color === 'tornado') {
          const s = evaluateMove(i, 0, 'top', undefined);
          if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i }]; }
          else if (s === maxScore) bestMoves.push({ cardIdx: i });
        } else {
          for (let col of availableCols) {
            for (let entry of ['top', 'bottom']) {
              if (card.color === 'chameleon') {
                for (let cc of ['red', 'blue', 'green', 'yellow']) {
                  const s = evaluateMove(i, col, entry, cc);
                  if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i, col, entry, chameleonColor: cc }]; }
                  else if (s === maxScore) bestMoves.push({ cardIdx: i, col, entry, chameleonColor: cc });
                }
              } else {
                const s = evaluateMove(i, col, entry, undefined);
                if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i, col, entry }]; }
                else if (s === maxScore) bestMoves.push({ cardIdx: i, col, entry });
              }
            }
          }
        }
      }

      const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      const randomCardIdx = chosenMove.cardIdx;
      const cardToPlayBase = hand[randomCardIdx];
      const randomCol = chosenMove.col !== undefined ? chosenMove.col : availableCols[0];
      const randomType = chosenMove.entry !== undefined ? chosenMove.entry : 'top';
      const chosenChameleonColor = chosenMove.chameleonColor;
      
      if (cardToPlayBase.color === 'gravity' || cardToPlayBase.color === 'tornado') {`;

code = code.replace(oldLogic, newLogic);

// We also need to fix the line where it chooses Chameleon color randomly and random column.
const oldDropLogic = `      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const randomType = Math.random() > 0.5 ? 'top' : 'bottom';
      
      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon') {
          const cols = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }`;

const newDropLogic = `      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon' && chosenChameleonColor) {
         cardToPlay.chameleonColor = chosenChameleonColor;
      } else if (cardToPlay.color === 'chameleon') {
         // Fallback just in case
         const cols = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }`;

code = code.replace(oldDropLogic, newDropLogic);

fs.writeFileSync('src/GameEngine.tsx', code);
