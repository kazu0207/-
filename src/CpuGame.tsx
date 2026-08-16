import React, { useState, useCallback } from 'react';
import { GameState, GameCard, PlayerState } from './types';
import { createDeck } from './gameLogic';
import { GameEngine } from './GameEngine';

export default function CpuGame({ onExit }: { onExit: () => void }) {
  const [cpuCount, setCpuCount] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const initGame = useCallback((numCpus: number) => {
    const numPlayers = numCpus + 1;
    const deck = createDeck('shared', numPlayers);
    
    const columns: GameCard[][] = [[], [], []];

    let players: PlayerState[] = [
      { id: 'player-1', name: 'あなた', isCpu: false, score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } } }
    ];

    for (let i = 0; i < numCpus; i++) {
      players.push({
        id: `cpu-${i+1}`,
        name: `CPU ${i+1}`,
        isCpu: true,
        score: 0,
        hand: [],
        stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
      });
    }

    // Shuffle players
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    // Deal 4 cards each
    players.forEach(p => {
      for(let i = 0; i < 4; i++) {
        p.hand.push(deck.pop()!);
      }
    });

    const initialState: GameState = {
      deck,
      columns,
      players,
      currentPlayerIndex: 0,
      status: 'playing',
      winnerId: null,
      comboCount: 0,
      matchedIds: [], gravity: 'normal', timeLeft: 10
    };

    setGameState(initialState);
  }, []);

  if (cpuCount === null) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <h2 className="text-4xl font-black mb-8 bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          対戦相手を選択
        </h2>
        <div className="flex gap-4">
          {[1, 2, 3].map(num => (
            <button 
              key={num}
              onClick={() => {
                setCpuCount(num);
                initGame(num);
              }}
              className="px-8 py-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <div className="text-4xl">🤖</div>
              <div className="font-bold text-xl">{num} CPU</div>
            </button>
          ))}
        </div>
        <button onClick={onExit} className="mt-12 text-slate-500 font-bold hover:text-white transition-colors px-6 py-2">
          ← メニューに戻る
        </button>
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <GameEngine 
      gameState={gameState}
      localPlayerId="player-1"
      isHost={true}
      updateState={setGameState}
      onExit={onExit}
      onPlayAgain={() => initGame(cpuCount)}
    />
  );
}
