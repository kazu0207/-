const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Add chameleonColor selection state
code = code.replace(
  /const \[boardHeight, setBoardHeight\] = useState<number>\(500\);/,
  `const [boardHeight, setBoardHeight] = useState<number>(500);
  const [chameleonColor, setChameleonColor] = useState<'red'|'blue'|'green'|'yellow' | null>(null);`
);

// Reset chameleonColor when selectedCardIdx changes
code = code.replace(
  /setSelectedCardIdx\(selectedCardIdx === i \? null : i\)/g,
  `setSelectedCardIdx(selectedCardIdx === i ? null : i); setChameleonColor(null);`
);

const handleActionCardCode = `
  const handleActionCardUse = (action: 'gravity' | 'tornado') => {
    if (gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null) return;
    const hand = activePlayer.hand;
    let newPlayers = [...gameState.players];
    let newDeck = [...gameState.deck];
    
    if (action === 'gravity') {
      newPlayers[gameState.currentPlayerIndex] = {
        ...activePlayer,
        hand: hand.filter((_, i) => i !== selectedCardIdx)
      };
      const newState = {
        ...gameState,
        players: newPlayers,
        gravity: gameState.gravity === 'normal' ? 'reverse' : 'normal' as 'normal' | 'reverse'
      };
      endTurn(newState, updateState);
    } else if (action === 'tornado') {
      // Collect all hands
      let allCards: GameCard[] = [];
      newPlayers = newPlayers.map(p => {
        allCards.push(...p.hand);
        return { ...p, hand: [] };
      });
      // Remove the used tornado card
      allCards = allCards.filter(c => c.id !== hand[selectedCardIdx].id);
      
      // Shuffle allCards
      for (let i = allCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
      }
      
      // Deal 4 back to each player (or max available)
      newPlayers = newPlayers.map(p => {
        const newHand = [];
        for (let i = 0; i < 4; i++) {
          if (allCards.length > 0) {
            newHand.push(allCards.pop()!);
          } else if (newDeck.length > 0) {
            newHand.push(newDeck.pop()!);
          }
        }
        return { ...p, hand: newHand };
      });
      
      const newState = {
        ...gameState,
        players: newPlayers,
        deck: newDeck
      };
      endTurn(newState, updateState);
    }
  };
`;

code = code.replace(
  /const handleColumnClick = \(colIdx: number, actionType: 'top' \| 'bottom'\) => \{/,
  handleActionCardCode + '\n  const handleColumnClick = (colIdx: number, actionType: \'top\' | \'bottom\') => {'
);

code = code.replace(
  /const cardToPlay = \{ \.\.\.hand\[selectedCardIdx\], entry: actionType \};/,
  `const cardToPlay = { ...hand[selectedCardIdx], entry: actionType, chameleonColor };`
);

fs.writeFileSync('src/GameEngine.tsx', code);
