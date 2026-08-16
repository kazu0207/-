import React, { useEffect, useCallback } from 'react';
import { GameState, GameCard, PlayerState } from './types';
import { createDeck } from './gameLogic';
import { GameEngine } from './GameEngine';
import { useMultiplayerStore } from './store';


export default function OnlineGame({ onExit }: { onExit: () => void }) {
  const { room, socket, syncState, userId } = useMultiplayerStore();

  const initGame = useCallback(() => {
    if (!room || !socket) return;
    
    // Only the first player in the room initializes
    const isHost = room.players[0]?.id === userId;
    if (!isHost) return;

    const columns: GameCard[][] = [[], [], []];

    let players: PlayerState[] = room.players.map(p => ({
      id: p.id,
      name: p.name,
      isCpu: false,
      score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
    }));

    let cpuCount = room.cpuCount || 0;
    if (room.players.length + cpuCount > 4) {
      cpuCount = Math.max(0, 4 - room.players.length);
    }
    for (let i = 0; i < cpuCount; i++) {
      players.push({
        id: `cpu-${i+1}`,
        name: `CPU ${i+1}`,
        isCpu: true,
        score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
      });
    }

    const numPlayers = players.length;
    const deck = createDeck('shared', numPlayers);

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

    syncState(initialState);
  }, [room, socket, syncState]);

  useEffect(() => {
    useMultiplayerStore.getState().registerCallbacks(
      (startedRoom) => {
        // Trigger initialization only if we are the host
        if (startedRoom.players[0]?.id === userId) {
          initGame();
        }
      },
      (state) => {
        // state updated
      }
    );
  }, [initGame, userId]);

  if (room?.status === 'waiting') {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <h2 className="text-3xl font-black mb-2 bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">待機ロビー</h2>
        <div className="bg-slate-900/80 border border-indigo-500/50 rounded-xl px-6 py-4 mb-8 flex flex-col items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="text-slate-400 text-sm font-bold uppercase mb-1">ルームID (友達に教えてあげよう)</span>
          <span className="text-4xl font-black text-white tracking-widest">{room.id}</span>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mb-8 shadow-xl">
        <div className="flex justify-between items-center w-full max-w-sm mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase">プレイヤー ({room.players.length + (room.cpuCount || 0)}/4)</h3>
          {(room.players[0]?.id === userId) ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">追加CPU:</span>
              <select 
                value={room.cpuCount || 0}
                onChange={(e) => useMultiplayerStore.getState().setCpuCount(parseInt(e.target.value, 10))}
                className="bg-slate-800 text-white text-sm rounded px-2 py-1 outline-none border border-slate-700"
              >
                <option value={0}>0</option>
                {room.players.length <= 3 && <option value={1}>1</option>}
                {room.players.length <= 2 && <option value={2}>2</option>}
              </select>
            </div>
          ) : (
            (room.cpuCount || 0) > 0 && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">追加CPU: {room.cpuCount}</span>
          )}
        </div>
        <ul className="flex flex-col gap-2 w-full max-w-sm mb-8">
            {room.players.map(p => (
              <li key={p.id} className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-lg border border-slate-700/50">
                <span className="font-bold">{p.name} {p.id === userId && <span className="text-indigo-400 ml-1 text-xs">(あなた)</span>}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${p.ready ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {p.ready ? '準備完了' : '準備中'}
                </span>
              </li>
            ))}
            {Array.from({ length: room.cpuCount || 0 }).map((_, i) => (
              <li key={`cpu-${i}`} className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/30">
                <span className="font-bold text-slate-400">🤖 CPU {i+1}</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-500">参加予定</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <button onClick={onExit} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold transition-all shadow-md">
            退出する
          </button>
          {room.players.length < 2 ? (
            <button 
              disabled
              className="px-8 py-3 rounded-xl bg-slate-700 text-slate-400 font-bold cursor-not-allowed shadow-md"
            >
              2人以上の参加が必要です
            </button>
          ) : (
            <button 
              onClick={() => useMultiplayerStore.getState().setReady(!room.players.find(p => p.id === userId)?.ready)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
            >
              {room.players.find(p => p.id === userId)?.ready ? '準備を取り消す' : '準備完了！'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!room?.gameState || !socket) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <div className="text-indigo-400 font-bold tracking-widest animate-pulse">CONNECTING...</div>
      </div>
    );
  }

  const isHost = room.players[0]?.id === userId;

  return (
    <GameEngine 
      gameState={room.gameState}
      localPlayerId={userId}
      isHost={isHost}
      updateState={syncState}
      onExit={onExit}
      onPlayAgain={isHost ? initGame : undefined}
    />
  );
}
