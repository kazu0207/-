const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const oldCpuEffect = `  // CPU Turn Logic
  useEffect(() => {
    if (!isHost || !isCpuTurn || gameState.status !== 'playing') return;
    
    const timer = setTimeout(() => {
      const hand = activePlayer.hand;
      if (hand.length === 0) return;
      
      const randomCardIdx = Math.floor(Math.random() * hand.length);
      const cardToPlayBase = hand[randomCardIdx];
      
      if (cardToPlayBase.color === 'gravity' || cardToPlayBase.color === 'tornado') {
        let newPlayers = [...gameState.players];
        let newDeck = [...gameState.deck];
        
        if (cardToPlayBase.color === 'gravity') {
          newPlayers[gameState.currentPlayerIndex] = {
            ...activePlayer,
            hand: hand.filter((_, i) => i !== randomCardIdx)
          };
          const newState = {
            ...gameState,
            players: newPlayers,
            gravity: gameState.gravity === 'normal' ? 'reverse' : 'normal' as 'normal'|'reverse'
          };
          endTurn(newState, updateState);
        } else {
          let allCards = [];
          newPlayers = newPlayers.map(p => {
            allCards.push(...p.hand);
            return { ...p, hand: [] };
          });
          allCards = allCards.filter(c => c.id !== cardToPlayBase.id);
          for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
          }
          newPlayers = newPlayers.map(p => {
            const newHand = [];
            for (let i = 0; i < 4; i++) {
              if (allCards.length > 0) newHand.push(allCards.pop());
              else if (newDeck.length > 0) newHand.push(newDeck.pop());
            }
            return { ...p, hand: newHand };
          });
          const newState = { ...gameState, players: newPlayers, deck: newDeck };
          endTurn(newState, updateState);
        }
        return;
      }
      
      const availableCols = [0, 1, 2].filter(c => gameState.columns[c].length < 40);
      if (availableCols.length === 0) return;
      
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const randomType = Math.random() > 0.5 ? 'top' : 'bottom';
      
      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon') { 
         const cols: ('red'|'blue'|'green'|'yellow')[] = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }
      
      let newPlayers = [...gameState.players];
      newPlayers[gameState.currentPlayerIndex] = {
        ...activePlayer,
        hand: hand.filter((_, i) => i !== randomCardIdx)
      };
      
      let newColumns = [...gameState.columns];
      const actualActionType = gameState.gravity === 'reverse' ? (randomType === 'top' ? 'bottom' : 'top') : randomType;
      if (actualActionType === 'top') {
        newColumns[randomCol] = [...newColumns[randomCol], cardToPlay];
      } else {
        newColumns[randomCol] = [cardToPlay, ...newColumns[randomCol]];
      }
      
      updateState({
        ...gameState,
        players: newPlayers,
        columns: newColumns,
        lastAction: { col: randomCol, type: randomType as 'top' | 'bottom' },
        status: 'animating_gravity',
        comboCount: 0
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [gameState.status, isHost, isCpuTurn]);`;

const newCpuEffect = `  // CPU Turn Logic
  useEffect(() => {
    if (!isHost || !isCpuTurn || gameState.status !== 'playing') return;
    
    const timer = setTimeout(() => {
      const currentState = gameStateRef.current;
      const currentActivePlayer = currentState.players[currentState.currentPlayerIndex];
      const hand = currentActivePlayer.hand;
      if (hand.length === 0) return;
      
      const randomCardIdx = Math.floor(Math.random() * hand.length);
      const cardToPlayBase = hand[randomCardIdx];
      
      if (cardToPlayBase.color === 'gravity' || cardToPlayBase.color === 'tornado') {
        let newPlayers = [...currentState.players];
        let newDeck = [...currentState.deck];
        
        if (cardToPlayBase.color === 'gravity') {
          newPlayers[currentState.currentPlayerIndex] = {
            ...currentActivePlayer,
            hand: hand.filter((_, i) => i !== randomCardIdx)
          };
          const newState = {
            ...currentState,
            players: newPlayers,
            gravity: currentState.gravity === 'normal' ? 'reverse' : 'normal' as 'normal'|'reverse'
          };
          endTurn(newState, updateState);
        } else {
          let allCards = [];
          newPlayers = newPlayers.map(p => {
            allCards.push(...p.hand);
            return { ...p, hand: [] };
          });
          allCards = allCards.filter(c => c.id !== cardToPlayBase.id);
          for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
          }
          newPlayers = newPlayers.map(p => {
            const newHand = [];
            for (let i = 0; i < 4; i++) {
              if (allCards.length > 0) newHand.push(allCards.pop());
              else if (newDeck.length > 0) newHand.push(newDeck.pop());
            }
            return { ...p, hand: newHand };
          });
          const newState = { ...currentState, players: newPlayers, deck: newDeck };
          endTurn(newState, updateState);
        }
        return;
      }
      
      const availableCols = [0, 1, 2].filter(c => currentState.columns[c].length < 40);
      if (availableCols.length === 0) return;
      
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const randomType = Math.random() > 0.5 ? 'top' : 'bottom';
      
      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon') { 
         const cols: ('red'|'blue'|'green'|'yellow')[] = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }
      
      let newPlayers = [...currentState.players];
      newPlayers[currentState.currentPlayerIndex] = {
        ...currentActivePlayer,
        hand: hand.filter((_, i) => i !== randomCardIdx)
      };
      
      let newColumns = [...currentState.columns];
      const actualActionType = currentState.gravity === 'reverse' ? (randomType === 'top' ? 'bottom' : 'top') : randomType;
      if (actualActionType === 'top') {
        newColumns[randomCol] = [...newColumns[randomCol], cardToPlay];
      } else {
        newColumns[randomCol] = [cardToPlay, ...newColumns[randomCol]];
      }
      
      updateState({
        ...currentState,
        players: newPlayers,
        columns: newColumns,
        lastAction: { col: randomCol, type: randomType as 'top' | 'bottom' },
        status: 'animating_gravity',
        comboCount: 0
      });
    }, 1500); // Wait 1.5 seconds so timer update doesn't race
    
    return () => clearTimeout(timer);
  }, [gameState.status, isHost, isCpuTurn]);`;

code = code.replace(oldCpuEffect, newCpuEffect);
fs.writeFileSync('src/GameEngine.tsx', code);
