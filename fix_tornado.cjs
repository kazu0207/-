const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// CPU tornado logic
const cpuRegex = /newPlayers = newPlayers\.map\(\(p, idx\) => \{\s*const newHand = \[\];\s*const cardsToDeal = idx === currentState\.currentPlayerIndex \? 3 : 4;\s*for \(let i = 0; i < cardsToDeal; i\+\+\) \{\s*if \(allCards\.length > 0\) newHand\.push\(allCards\.pop\(\)\);\s*else if \(newDeck\.length > 0\) newHand\.push\(newDeck\.pop\(\)\);\s*\}\s*return \{ \.\.\.p, hand: newHand \};\s*\}\);/;

const cpuNewCode = `newPlayers = newPlayers.map((p, idx) => {
            const newHand = [];
            let cardsToDeal = currentState.players[idx].hand.length;
            if (idx === currentState.currentPlayerIndex) cardsToDeal -= 1;
            
            for (let i = 0; i < cardsToDeal; i++) {
              if (allCards.length > 0) newHand.push(allCards.pop());
            }
            return { ...p, hand: newHand };
          });`;
code = code.replace(cpuRegex, cpuNewCode);

// Player tornado logic
const playerRegex = /newPlayers = newPlayers\.map\(\(p, idx\) => \{\s*const newHand = \[\];\s*const cardsToDeal = idx === gameState\.currentPlayerIndex \? 3 : 4;\s*for \(let i = 0; i < cardsToDeal; i\+\+\) \{\s*if \(allCards\.length > 0\) \{\s*newHand\.push\(allCards\.pop\(\)\);\s*\} else if \(newDeck\.length > 0\) \{\s*newHand\.push\(newDeck\.pop\(\)\);\s*\}\s*\}\s*return \{ \.\.\.p, hand: newHand \};\s*\}\);/;

const playerNewCode = `newPlayers = newPlayers.map((p, idx) => {
        const newHand = [];
        let cardsToDeal = gameState.players[idx].hand.length;
        if (idx === gameState.currentPlayerIndex) cardsToDeal -= 1;
        
        for (let i = 0; i < cardsToDeal; i++) {
          if (allCards.length > 0) {
            newHand.push(allCards.pop());
          }
        }
        return { ...p, hand: newHand };
      });`;
code = code.replace(playerRegex, playerNewCode);

fs.writeFileSync('src/GameEngine.tsx', code);
