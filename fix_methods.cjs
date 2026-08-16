const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const replacement = `  // CPU Turn Logic
  useEffect(() => {
    if (!isHost || !isCpuTurn || gameState.status !== 'playing') return;
    
    const timer = setTimeout(() => {
      const currentState = gameStateRef.current;
      const currentActivePlayer = currentState.players[currentState.currentPlayerIndex];
      const hand = currentActivePlayer.hand;
      if (hand.length === 0) {
         endTurn(currentState, updateState);
         return;
      }
      
      const availableCols = [0, 1, 2].filter(c => currentState.columns[c].length < 40);
      if (availableCols.length === 0) {
         endTurn(currentState, updateState);
         return;
      }

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
          updateState({
            ...currentState,
            players: newPlayers,
            gravity: currentState.gravity === 'normal' ? 'reverse' : 'normal',
            status: 'animating_gravity',
            comboCount: 0,
            comboOwnerIndex: currentState.currentPlayerIndex,
            lastAction: undefined
          });
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
      
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const randomType = Math.random() > 0.5 ? 'top' : 'bottom';
      
      playDrop();
      const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
      if (cardToPlay.color === 'chameleon') { 
         const cols = ['red', 'blue', 'green', 'yellow'];
         cardToPlay.chameleonColor = cols[Math.floor(Math.random() * cols.length)];
      }
      
      let newDeck = [...currentState.deck];
      let newPlayers = [...currentState.players];
      newPlayers[currentState.currentPlayerIndex] = {
        ...currentActivePlayer,
        hand: hand.filter((_, i) => i !== randomCardIdx)
      };
      
      let newColumns = [...currentState.columns];
      
      if (randomType === 'top') {
        newColumns[randomCol] = [...newColumns[randomCol], cardToPlay];
      } else {
        newColumns[randomCol] = [cardToPlay, ...newColumns[randomCol]];
      }
      
      updateState({
        ...currentState,
        players: newPlayers,
        deck: newDeck,
        columns: newColumns,
        lastAction: { col: randomCol, type: randomType as 'top' | 'bottom' },
        status: 'animating_gravity',
        comboCount: 0,
        comboOwnerIndex: currentState.currentPlayerIndex
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [gameState.status, gameState.currentPlayerIndex, isHost, isCpuTurn]);

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
      updateState({
        ...gameState,
        players: newPlayers,
        gravity: gameState.gravity === 'normal' ? 'reverse' : 'normal',
        status: 'animating_gravity',
        comboCount: 0,
        comboOwnerIndex: gameState.currentPlayerIndex,
        lastAction: undefined
      });
      setSelectedCardIdx(null);
    } else if (action === 'tornado') {
      let allCards = [];
      newPlayers = newPlayers.map(p => {
        allCards.push(...p.hand);
        return { ...p, hand: [] };
      });
      allCards = allCards.filter(c => c.id !== hand[selectedCardIdx].id);
      for (let i = allCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
      }
      newPlayers = newPlayers.map(p => {
        const newHand = [];
        for (let i = 0; i < 4; i++) {
          if (allCards.length > 0) {
            newHand.push(allCards.pop());
          } else if (newDeck.length > 0) {
            newHand.push(newDeck.pop());
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
      setSelectedCardIdx(null);
    }
  };

  const handleColumnClick = (colIdx: number, actionType: 'top' | 'bottom') => {
    if (gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null) return;
    
    playDrop();
    const hand = activePlayer.hand;
    const cardToPlay = { ...hand[selectedCardIdx], entry: actionType, chameleonColor: chameleonColor || undefined };
    
    let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayerIndex] = {
      ...activePlayer,
      hand: hand.filter((_, i) => i !== selectedCardIdx)
    };
    
    let newColumns = [...gameState.columns];
    if (actionType === 'top') {
      newColumns[colIdx] = [...newColumns[colIdx], cardToPlay];
    } else {
      newColumns[colIdx] = [cardToPlay, ...newColumns[colIdx]];
    }
    
    updateState({
      ...gameState,
      players: newPlayers,
      deck: newDeck,
      columns: newColumns,
      lastAction: { col: colIdx, type: actionType },
      status: 'animating_gravity',
      comboCount: 0,
      comboOwnerIndex: gameState.currentPlayerIndex
    });
    setSelectedCardIdx(null);
  };

  const maxColLength = Math.max(1, ...gameState.columns.map(c => c.length));`;

code = code.replace("const maxColLength = Math.max(1, ...gameState.columns.map(c => c.length));", replacement);
fs.writeFileSync('src/GameEngine.tsx', code);
