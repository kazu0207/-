const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. animating_match logic
code = code.replace(
  /newPlayers\[gameState\.currentPlayerIndex\] = \{\s*\.\.\.activePlayer,\s*score: activePlayer\.score \+ \(gameState\.pendingPoints \|\| 0\)\s*\};/,
  `const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;
        newPlayers[ownerIdx] = {
          ...newPlayers[ownerIdx],
          score: newPlayers[ownerIdx].score + (gameState.pendingPoints || 0)
        };`
);

// 2. animating_gravity (findMatches) logic
code = code.replace(
  /turnGainedPointsPlayerName: activePlayer\.name/,
  `turnGainedPointsPlayerName: gameState.players[gameState.comboOwnerIndex ?? gameState.currentPlayerIndex].name`
);

code = code.replace(
  /\} else \{\s*\/\/ Turn ends!\s*endTurn\(gameState, updateState\);\s*\}/,
  `} else {
          if (gameState.comboOwnerIndex !== undefined) {
            updateState({
              ...gameState,
              status: 'playing',
              comboCount: 0,
              pendingPoints: 0,
              turnGainedPoints: 0
            });
          } else {
             endTurn(gameState, updateState);
          }
        }`
);

// 3. handleColumnClick
const handleColumnClickOld = `    let newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayerIndex] = {
      ...activePlayer,
      hand: hand.filter((_, i) => i !== selectedCardIdx)
    };
    
    let newColumns = [...gameState.columns];
    const actualActionType = gameState.gravity === 'reverse' ? (actionType === 'top' ? 'bottom' : 'top') : actionType;
    if (actualActionType === 'top') {
      newColumns[colIdx] = [...newColumns[colIdx], cardToPlay];
    } else {
      newColumns[colIdx] = [cardToPlay, ...newColumns[colIdx]];
    }
    
    updateState({
      ...gameState,
      players: newPlayers,
      columns: newColumns,
      lastAction: { col: colIdx, type: actionType },
      status: 'animating_gravity',
      comboCount: 0
    });`;

const handleColumnClickNew = `    let newDeck = [...gameState.deck];
    let newPlayers = [...gameState.players];
    newPlayers[gameState.currentPlayerIndex] = {
      ...activePlayer,
      hand: hand.filter((_, i) => i !== selectedCardIdx)
    };
    
    // Draw immediately
    if (newPlayers[gameState.currentPlayerIndex].hand.length < 4 && newDeck.length > 0) {
      const card = newDeck.pop();
      if (card) {
        newPlayers[gameState.currentPlayerIndex].hand.push(card);
      }
    }
    const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    let newColumns = [...gameState.columns];
    const actualActionType = gameState.gravity === 'reverse' ? (actionType === 'top' ? 'bottom' : 'top') : actionType;
    if (actualActionType === 'top') {
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
      currentPlayerIndex: nextIndex,
      comboOwnerIndex: gameState.currentPlayerIndex,
      timeLeft: 10
    });
    setSelectedCardIdx(null);`;

code = code.replace(handleColumnClickOld, handleColumnClickNew);

// 4. CPU normal card
const cpuNormalOld = `      let newPlayers = [...currentState.players];
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
      });`;

const cpuNormalNew = `      let newDeck = [...currentState.deck];
      let newPlayers = [...currentState.players];
      newPlayers[currentState.currentPlayerIndex] = {
        ...currentActivePlayer,
        hand: hand.filter((_, i) => i !== randomCardIdx)
      };
      
      if (newPlayers[currentState.currentPlayerIndex].hand.length < 4 && newDeck.length > 0) {
        const card = newDeck.pop();
        if (card) {
          newPlayers[currentState.currentPlayerIndex].hand.push(card);
        }
      }
      const nextIndex = (currentState.currentPlayerIndex + 1) % currentState.players.length;

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
        deck: newDeck,
        columns: newColumns,
        lastAction: { col: randomCol, type: randomType as 'top' | 'bottom' },
        status: 'animating_gravity',
        comboCount: 0,
        currentPlayerIndex: nextIndex,
        comboOwnerIndex: currentState.currentPlayerIndex,
        timeLeft: 10
      });`;

code = code.replace(cpuNormalOld, cpuNormalNew);

fs.writeFileSync('src/GameEngine.tsx', code);
