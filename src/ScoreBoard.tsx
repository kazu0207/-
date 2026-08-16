import React from 'react';
import { GameState, PlayerState } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export function ScoreBoard({ gameState, localPlayerId, onExit, onPlayAgain, isHost }: { gameState: GameState, localPlayerId: string, onExit: () => void, onPlayAgain?: () => void, isHost: boolean }) {
 // Sort players by score descending
 const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
 
 const getGridClass = (index: number, total: number) => {
 if (total === 2) {
 if (index === 0) return 'row-span-2 col-start-1';
 if (index === 1) return 'row-span-2 col-start-2';
 } else if (total === 3) {
 if (index === 0) return 'col-span-2';
 if (index === 1) return 'col-start-1 row-start-2';
 if (index === 2) return 'col-start-2 row-start-2';
 }
 return '';
 };

 const getRank = (index: number) => {
 // Basic ranking (could handle ties if needed, but simple index + 1 is fine for now)
 return index + 1;
 };

 return (
 <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar backdrop-blur-xl p-2 ">
 <h2 className="text-3xl font-black mb-1 tracking-tighter bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-lg shrink-0">
 GAME OVER
 </h2>
 <p className="text-lg font-bold text-white mb-4 shrink-0">
 {gameState.winnerId === localPlayerId 
 ? "🎊 あなたの勝利！ 🎊" 
 : gameState.winnerId 
 ? `${gameState.players.find(p => p.id === gameState.winnerId)?.name} の勝利！`
 : "引き分け！"}
 </p>

 <div className={cn(
 "grid grid-cols-2 gap-2 w-full max-w-5xl mb-4 shrink-0",
 sortedPlayers.length > 2 ? "grid-rows-2" : "grid-rows-1"
 )}>
 {sortedPlayers.map((p, idx) => {
 const stats = p.stats || { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
 return (

 <div key={p.id} className={cn(
 "bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 shadow-2xl flex flex-col",
 getGridClass(idx, sortedPlayers.length),
 p.id === localPlayerId && "border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-slate-800/80"
 )}>
 <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
 <div className="flex items-center gap-3">
 <div className={cn(
 "text-xl font-black w-8 h-8 flex items-center justify-center rounded-full text-slate-900",
 idx === 0 ? "bg-gradient-to-br from-yellow-300 to-amber-500" :
 idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500" :
 idx === 2 ? "bg-gradient-to-br from-amber-600 to-orange-800" :
 "bg-slate-700 text-slate-300"
 )}>
 {getRank(idx)}
 </div>
 <h3 className="text-lg font-bold truncate max-w-[150px]">{p.name}</h3>
 </div>
 <div className="text-right">
 <div className="text-xs text-slate-400 font-bold tracking-widest">SCORE</div>
 <div className="text-2xl font-black text-cyan-400">{p.score}</div>
 </div>
 </div>

 <div className="flex-1 grid grid-cols-1 gap-x-4 gap-y-1 text-xs ">
 {/* Left Column */}
 <div className="space-y-1">
 <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
 <span className="text-slate-300">最大コンボ数</span>
 <span className="font-bold">{stats.maxCombo}</span>
 </div>
 <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
 <span className="text-slate-300">ライン消去数</span>
 <span className="font-bold">{stats.linesCleared}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・同時ライン消去数</span>
 <span className="font-bold text-slate-300">{stats.maxSimultaneousLines}</span>
 </div>
 
 <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded mt-2">
 <span className="text-slate-300">ブロック消去数</span>
 <span className="font-bold">{stats.blocksCleared.total}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・おじゃま</span>
 <span className="font-bold text-slate-300">{stats.blocksCleared.ojama}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-red-400 text-xs">・赤</span>
 <span className="font-bold text-slate-300">{stats.blocksCleared.red}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-blue-400 text-xs">・青</span>
 <span className="font-bold text-slate-300">{stats.blocksCleared.blue}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-green-400 text-xs">・緑</span>
 <span className="font-bold text-slate-300">{stats.blocksCleared.green}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-yellow-400 text-xs">・黄</span>
 <span className="font-bold text-slate-300">{stats.blocksCleared.yellow}</span>
 </div>
 </div>

 {/* Right Column */}
 <div className="space-y-1">
 <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
 <span className="text-slate-300">特殊カード使用</span>
 <span className="font-bold">{stats.specialCardsUsed.total}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・グラビティー</span>
 <span className="font-bold text-slate-300">{stats.specialCardsUsed.gravity}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・トルネード</span>
 <span className="font-bold text-slate-300">{stats.specialCardsUsed.tornado}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・カメレオン</span>
 <span className="font-bold text-slate-300">{stats.specialCardsUsed.chameleon}</span>
 </div>
 <div className="flex justify-between items-center px-2 py-0.5">
 <span className="text-slate-400 text-xs">・おじゃま</span>
 <span className="font-bold text-slate-300">{stats.specialCardsUsed.ojama}</span>
 </div>
 </div>
 </div>
 </div>
 )})}
 </div>

 <div className="flex gap-4 pb-4 shrink-0">
 <button 
 onClick={onExit}
 className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-sm transition-all"
 >
 退出する
 </button>
 {onPlayAgain && isHost && (
 <button 
 onClick={onPlayAgain}
 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-full font-bold text-sm shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"
 >
 もう一度プレイ
 </button>
 )}
 </div>
 </div>
 );
}
