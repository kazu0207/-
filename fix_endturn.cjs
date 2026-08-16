const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  /function endTurn\(state: GameState, updater: \(s: GameState\) => void\) \{[\s\S]*?setSelectedCardIdx\(null\);\n  \};/,
  `function endTurn(state: GameState, updater: (s: GameState) => void) {
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
  };`
);

fs.writeFileSync('src/GameEngine.tsx', code);
