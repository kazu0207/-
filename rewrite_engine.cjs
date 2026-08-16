const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// We will make several targeted replaces.

// 1. Add timer logic inside GameEngine
// Right after `const shouldExecuteLoop = isActiveLocal || (isHost && isCpuTurn);`
const timerLogic = `
  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.winnerId) return;
    if (!shouldExecuteLoop) return;
    
    const timer = setInterval(() => {
      if (gameState.timeLeft > 0) {
        updateState({ ...gameState, timeLeft: gameState.timeLeft - 1 });
      } else {
        // Auto-pass turn
        endTurn(gameState, updateState);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.status, gameState.timeLeft, shouldExecuteLoop]);
  
  const endTurn = (state: GameState, updater: (s: GameState) => void) => {
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
    if (newPlayers[nextIndex].hand.length < 4 && newDeck.length > 0) {
      const card = newDeck.pop();
      if (card) {
        newPlayers[nextIndex] = { ...newPlayers[nextIndex], hand: [...newPlayers[nextIndex].hand, card] };
      }
    }
    updater({
      ...state,
      players: newPlayers,
      deck: newDeck,
      currentPlayerIndex: nextIndex,
      status: 'playing',
      comboCount: 0,
      pendingPoints: 0,
      turnGainedPoints: 0,
      timeLeft: 10
    });
    setSelectedCardIdx(null);
  };
`;
code = code.replace(/const shouldExecuteLoop = isActiveLocal \|\| \(isHost && isCpuTurn\);/, 'const shouldExecuteLoop = isActiveLocal || (isHost && isCpuTurn);\n' + timerLogic);

// Replace old turn ending logic
code = code.replace(/\/\/ Check for Game Over condition:[\s\S]*?turnGainedPoints: 0\s*\}\);\s*\}/, `endTurn(gameState, updateState);`);

fs.writeFileSync('src/GameEngine.tsx', code);
