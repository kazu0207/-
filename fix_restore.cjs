const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// The broken code starts at `const timer = setInterval(() => {`
// and ends at `setSelectedCardIdx(null);        setSelectedCardIdx(null);  };`

const brokenCodeRegex = /const timer = setInterval\(\(\) => \{\s*const currentState = gameStateRef\.current;\s*if \(currentState\.timeLeft > 0\) \{\s*updateState\(\{[\s\S]*?setSelectedCardIdx\(null\);\s*\}\s*setSelectedCardIdx\(null\);\s*\};\s*const maxColLength = Math\.max\(1, \.\.\.gameState\.columns\.map\(c => c\.length\)\);/;

// Wait, let's just use string indexOf to be perfectly safe.
const startStr = 'const timer = setInterval(() => {\n      const currentState = gameStateRef.current;\n      if (currentState.timeLeft > 0) {';
const startIdx = code.indexOf(startStr);

if (startIdx !== -1) {
  // Let's find the end which is `const maxColLength =`
  const endStr = 'const maxColLength = Math.max(1, ...gameState.columns.map(c => c.length));';
  const endIdx = code.indexOf(endStr, startIdx);
  
  if (endIdx !== -1) {
    const replacement = `const timer = setInterval(() => {
      const currentState = gameStateRef.current;
      if (currentState.timeLeft > 0) {
        updateState({ ...currentState, timeLeft: currentState.timeLeft - 1 });
      } else {
        // Auto-pass turn
        endTurn(currentState, updateState);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.status, shouldExecuteLoop]);

  function endTurn(state: GameState, updater: (s: GameState) => void) {
    if (state.deck.length === 0) {
      let maxScore = -1;
      let winnerId = null;
      state.players.forEach(p => {
        if (p.score > maxScore) { maxScore = p.score; winnerId = p.id; }
      });
      if (winnerId) { confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } }); }
      updater({ ...state, status: 'gameover', winnerId });
      return;
    }
    const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    let newPlayers = [...state.players];
    let newDeck = [...state.deck];
    if (newPlayers[state.currentPlayerIndex].hand.length < 4 && newDeck.length > 0) {
      const card = newDeck.pop();
      if (card) {
        newPlayers[state.currentPlayerIndex] = { ...newPlayers[state.currentPlayerIndex], hand: [...newPlayers[state.currentPlayerIndex].hand, card] };
      }
    }
    updater({
      ...state,
      players: newPlayers,
      deck: newDeck,
      currentPlayerIndex: nextIndex,
      comboOwnerIndex: undefined,
      status: 'playing',
      comboCount: 0,
      pendingPoints: 0,
      turnGainedPoints: 0,
      timeLeft: 10
    });
    setSelectedCardIdx(null);
  }

  useEffect(() => {
    if (!shouldExecuteLoop) return;
    if (gameState.status === 'animating_match') {
      const timer = setTimeout(() => {
        let newColumns = gameState.columns.map(col => col.filter(c => !gameState.matchedIds.includes(c.id)));
        let newPlayers = [...gameState.players];
        const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;
        newPlayers[ownerIdx] = {
          ...newPlayers[ownerIdx],
          score: newPlayers[ownerIdx].score + (gameState.pendingPoints || 0)
        };
        
        if (gameState.comboCount > 0) {
          playCombo(gameState.comboCount);
        } else {
          playPop();
        }
        updateState({
          ...gameState,
          columns: newColumns,
          players: newPlayers,
          status: 'animating_gravity'
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, shouldExecuteLoop]);

  useEffect(() => {
    if (!shouldExecuteLoop) return;
    if (gameState.status === 'animating_gravity') {
      const timer = setTimeout(() => {
        const { matchedIds, linesCount } = findMatches(gameState.columns);
        
        if (matchedIds.length > 0) {
          const combo = gameState.comboCount + 1;
          
          let basePoints = 0;
          if (linesCount === 1) basePoints = 1;
          else if (linesCount === 2) basePoints = 3;
          else if (linesCount === 3) basePoints = 5;
          else if (linesCount >= 4) basePoints = 10;
          
          const points = basePoints * combo;
          
          updateState({
            ...gameState,
            matchedIds,
            comboCount: combo,
            pendingPoints: points,
            status: 'animating_match',
            turnGainedPoints: (gameState.turnGainedPoints || 0) + points,
            turnGainedPointsPlayerName: gameState.players[gameState.comboOwnerIndex ?? gameState.currentPlayerIndex].name
          });
        } else {
          endTurn(gameState, updateState);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, shouldExecuteLoop]);

  `;
  
    code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('src/GameEngine.tsx', code);
    console.log("Restored successfully!");
  } else {
    console.log("End string not found");
  }
} else {
  console.log("Start string not found");
}
