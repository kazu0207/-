import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { GameState, GameCard, CardColor } from './types';
import { findMatches } from './gameLogic';
import { playSelect, playDrop, playPop, playCombo, playSpecial, startBgm, stopBgm } from './audio';
import { ArrowUpDown, Tornado, Settings } from 'lucide-react';
import { useMultiplayerStore } from './store';
import { ScoreBoard } from './ScoreBoard';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

type Connections = { top: boolean; bottom: boolean; left: boolean; right: boolean };

export function TCGCard({ 
 card, 
 onClick, 
 selected = false,
 className
}: { 
 card: GameCard; 
 onClick?: () => void;
 selected?: boolean;
 className?: string;
}) {
 const colorHex = {
 red: '#e11d48', // rose-600
 blue: '#0891b2', // cyan-600
 green: '#059669', // emerald-600
 yellow: '#d97706' // amber-600
 }[card.color];
 
 const isOjama = card.color === 'ojama';
 const isChameleon = card.color === 'chameleon';
 const isGravity = card.color === 'gravity';
 const isTornado = card.color === 'tornado';
 const isSpecial = isOjama || isChameleon || isGravity || isTornado;

 return (
 <motion.div
 layoutId={card.id}
 className={cn(
 "relative rounded-xl border-2 shadow-lg flex flex-col justify-center items-center overflow-hidden transition-all duration-300 w-full max-w-[80px] aspect-[5/7]",
 selected ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-50" : "border-white/20 z-10 hover:border-white/50 cursor-pointer",
 className,
 isSpecial ? "bg-white" : ""
 )}
 style={{
 backgroundColor: isSpecial ? undefined : colorHex,
 scale: selected ? 1.1 : 1,
 y: selected ? -10 : 0
 }}
 onClick={onClick}
 >
 {isOjama && (
 <div className="w-full h-full bg-white flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-slate-200 rounded-full"></div>
 </div>
 )}
 
 {isChameleon && (
 <div className="w-full h-full relative">
 <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#e11d48]" />
 <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#0891b2]" />
 <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#059669]" />
 <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#d97706]" />
 </div>
 )}
 
 {isGravity && (
 <div className="w-full h-full bg-white flex items-center justify-center">
 <ArrowUpDown className="w-10 h-10 text-slate-700" />
 </div>
 )}
 
 {isTornado && (
 <div className="w-full h-full bg-white flex items-center justify-center">
 <Tornado className="w-10 h-10 text-slate-700" />
 </div>
 )}
 
 {!isSpecial && (
 <>
 <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
 <div className="w-[50%] h-[50%] max-w-[40px] max-h-[40px] rounded-full bg-white/20 border border-white/40 flex items-center justify-center z-10">
 <div className="w-[60%] h-[60%] rounded-full bg-white/60 blur-[2px]" />
 </div>
 </>
 )}
 <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none shadow-inner" />
 </motion.div>
 );
}

export function PuyoBlock({ 
 card, 
 onClick, 
 selected = false,
 isMatched = false,
 connections = { top: false, bottom: false, left: false, right: false },
 className
}: { 
 card: Card; 
 onClick?: () => void;
 selected?: boolean;
 isMatched?: boolean;
 connections?: Connections;
 className?: string;
}) {
 const size = 64;
 const [hasEntered, setHasEntered] = React.useState(false);

 React.useEffect(() => {
 const t = setTimeout(() => setHasEntered(true), 800);
 return () => clearTimeout(t);
 }, []);

 const isTopDrop = card.entry === 'top';
 const isBottomInsert = card.entry === 'bottom';

 const getRadius = (vert: boolean, horiz: boolean) => {
 if (vert && horiz) return '4px'; 
 if (vert || horiz) return '8px'; 
 return '24px'; 
 };
 
 const borderRadius = `${getRadius(connections.top, connections.left)} ${getRadius(connections.top, connections.right)} ${getRadius(connections.bottom, connections.right)} ${getRadius(connections.bottom, connections.left)}`;

 const actualColor = card.chameleonColor || card.color;
 const colorHex = {
 red: '#e11d48',
 blue: '#0891b2',
 green: '#059669',
 yellow: '#d97706',
 ojama: '#ffffff',
 chameleon: '#9333ea',
 gravity: '#475569',
 tornado: '#14b8a6'
 }[actualColor as keyof typeof colorHex] || '#ffffff';

 return (
 <motion.div 
 layoutId={`puyo-${card.id}`}
 initial={{
 opacity: 1,
 y: isTopDrop ? -300 : (isBottomInsert ? 64 : 0),
 scale: 1
 }}
 animate={
 isMatched 
 ? { 
 opacity: [1, 0, 1, 0, 1, 1, 0], 
 scale: [1, 1, 1, 1, 1, 1.3, 1.6], 
 filter: ['brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(1)', 'brightness(2)'],
 y: 0,
 x: 0
 }
 : { 
 opacity: 1, 
 scale: 1,
 y: selected ? -10 : (!hasEntered ? (isTopDrop ? [-300, 0, -30, 0, -10, 0] : (isBottomInsert ? [64, 0] : 0)) : 0),
 }
 }
 exit={{ opacity: 0, scale: 0, filter: 'brightness(2)' }}
 transition={
 isMatched
 ? { duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeInOut" }
 : (!hasEntered && isTopDrop)
 ? { duration: 0.6, times: [0, 0.4, 0.6, 0.75, 0.9, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] }
 : (!hasEntered && isBottomInsert)
 ? { duration: 0.25, ease: "easeOut" }
 : { type: "spring", stiffness: 500, damping: 30, mass: 1 }
 }
 className={cn("relative select-none block", className)}
 style={{ 
 width: size, 
 height: size, 
 cursor: onClick ? 'pointer' : 'default',
 zIndex: selected ? 50 : 1
 }}
 onClick={onClick}
 >
 {card.color === 'ojama' ? (
 <div 
 className="absolute inset-0.5 border-2 border-slate-200 bg-white shadow-inner flex items-center justify-center overflow-hidden"
 style={{ borderRadius }}
 >
 <div className="w-1/2 h-1/2 border-4 border-slate-200 rounded-full" />
 </div>
 ) : (
 <div 
 className="absolute inset-0.5 border border-white/20 shadow-inner flex items-center justify-center overflow-hidden"
 style={{ 
 backgroundColor: colorHex,
 borderRadius,
 boxShadow: isMatched ? '0 0 20px 10px rgba(255,255,255,0.8)' : `inset 0 0 10px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.4)`
 }}
 >
 {card.color === 'chameleon' && (
 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
 )}
 {card.color === 'gravity' && (
 <span className="text-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🔄</span>
 )}
 {card.color === 'tornado' && (
 <span className="text-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🌪️</span>
 )}
 </div>
 )}
 </motion.div>
 );
}


function recordSpecialCardUse(players, playerIndex, card) {
 if (!['gravity', 'tornado', 'chameleon', 'ojama'].includes(card.color)) return players;
 const newPlayers = [...players];
 const defaultStats = { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
 const stats = newPlayers[playerIndex].stats ? { ...newPlayers[playerIndex].stats } : defaultStats;
 stats.specialCardsUsed = { ...stats.specialCardsUsed };
 stats.specialCardsUsed.total++;
 if (card.color === 'gravity') stats.specialCardsUsed.gravity++;
 if (card.color === 'tornado') stats.specialCardsUsed.tornado++;
 if (card.color === 'chameleon') stats.specialCardsUsed.chameleon++;
 if (card.color === 'ojama') stats.specialCardsUsed.ojama++;
 newPlayers[playerIndex] = { ...newPlayers[playerIndex], stats };
 return newPlayers;
}
export function GameEngine({
 gameState,
 localPlayerId,
 isHost,
 updateState,
 onExit,
 onPlayAgain
}: {
 gameState: GameState;
 localPlayerId: string;
 isHost: boolean;
 updateState: (state: GameState) => void;
 onExit: () => void;
 onPlayAgain?: () => void;
}) {
 const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
 const [boardHeight, setBoardHeight] = useState<number>(500);
 const [chameleonColor, setChameleonColor] = useState<'red'|'blue'|'green'|'yellow' | null>(null);
 const [isOptionsOpen, setIsOptionsOpen] = useState(false);
 const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
 useEffect(() => {
 const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);
 const { bgmVolume, seVolume, setBgmVolume, setSeVolume, mode } = useMultiplayerStore();
 const gameStateRef = useRef(gameState);
 useEffect(() => {
 gameStateRef.current = gameState;
 }, [gameState]);
 const boardRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (!boardRef.current) return;
 const observer = new ResizeObserver((entries) => {
 for (let entry of entries) {
 setBoardHeight(entry.contentRect.height);
 }
 });
 observer.observe(boardRef.current);
 return () => observer.disconnect();
 }, []);

 // Active player resolving state
 const activePlayer = gameState.players[gameState.currentPlayerIndex];
 const isActiveLocal = activePlayer?.id === localPlayerId;
 const isCpuTurn = activePlayer?.isCpu;

 // Resolving Loop (Only active player or host (if CPU) executes this to avoid race conditions)
 const isPaused = isOptionsOpen && mode === 'cpu';
 const shouldExecuteLoop = (isActiveLocal || (isHost && isCpuTurn)) && !isPaused;

 useEffect(() => {
 if (gameState.status !== 'gameover') {
 startBgm();
 } else {
 stopBgm();
 }
 }, [gameState.status]);

 useEffect(() => {
 return () => stopBgm();
 }, []);


 useEffect(() => {
 if (gameState.status !== 'playing' || gameState.winnerId) return;
 if (!shouldExecuteLoop) return;
 
 const timer = setInterval(() => {
 const currentState = gameStateRef.current;
 if (currentState.timeLeft > 0) {
 updateState({ ...currentState, timeLeft: currentState.timeLeft - 1 });
 } else {
 // Auto-pass turn
 endTurn(currentState, updateState);
 }
 }, 1000);
 return () => clearInterval(timer);
 }, [gameState.status, shouldExecuteLoop, isPaused]);

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
 
 // 次のターンのプレイヤーの手札が4枚になるまで補充する
 while (newPlayers[nextIndex].hand.length < 4 && newDeck.length > 0) {
 const card = newDeck.pop();
 if (card) {
 newPlayers[nextIndex] = { 
 ...newPlayers[nextIndex], 
 hand: [...newPlayers[nextIndex].hand, card] 
 };
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
 timeLeft: 10,
 activeActionCard: undefined
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
 }, 850);
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
 const ownerIdx = gameState.comboOwnerIndex ?? gameState.currentPlayerIndex;
 let newPlayers = [...gameState.players];
 const defaultStats = { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
 let stats = newPlayers[ownerIdx].stats ? { ...newPlayers[ownerIdx].stats } : defaultStats;
 
 stats.maxCombo = Math.max(stats.maxCombo, combo);
 stats.linesCleared += linesCount;
 stats.maxSimultaneousLines = Math.max(stats.maxSimultaneousLines, linesCount);
 
 const matchedBlocks = gameState.columns.flat().filter(c => matchedIds.includes(c.id));
 stats.blocksCleared = { ...stats.blocksCleared };
 matchedBlocks.forEach(b => {
 stats.blocksCleared.total++;
 const col = b.color === 'chameleon' ? (b.chameleonColor || 'chameleon') : b.color;
 if (col === 'red') stats.blocksCleared.red++;
 else if (col === 'blue') stats.blocksCleared.blue++;
 else if (col === 'green') stats.blocksCleared.green++;
 else if (col === 'yellow') stats.blocksCleared.yellow++;
 else if (col === 'ojama') stats.blocksCleared.ojama++;
 });
 
 newPlayers[ownerIdx] = { ...newPlayers[ownerIdx], stats };
 
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
 lastAction: undefined,
 turnGainedPoints: (gameState.turnGainedPoints || 0) + points,
 turnGainedPointsPlayerName: gameState.players[gameState.comboOwnerIndex ?? gameState.currentPlayerIndex].name, players: newPlayers
 });
 } else {
 endTurn(gameState, updateState);
 }
 }, 500);
 return () => clearTimeout(timer);
 }
 }, [gameState.status, shouldExecuteLoop]);

 // CPU Turn Logic
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

 // -- NEW AI LOGIC --
 let bestMoves = [];
 let maxScore = -Infinity;

 const evaluateMove = (cardIdx, col, entry, chameleonColor) => {
 let score = 0;
 let simCols = currentState.columns.map(c => [...c]);
 const card = hand[cardIdx];

 if (card.color === 'gravity') {
 simCols = simCols.map(c => [...c].reverse());
 const matches = findMatches(simCols);
 if (matches.matchedIds.length > 0) return 2000 + matches.matchedIds.length * 100;
 return -50;
 }
 if (card.color === 'tornado') {
 return -200;
 }

 const simCard = { ...card, entry };
 if (simCard.color === 'chameleon' && chameleonColor) simCard.chameleonColor = chameleonColor;

 const actualActionType = currentState.gravity === 'reverse' ? (entry === 'top' ? 'bottom' : 'top') : entry;
 if (actualActionType === 'top') {
 simCols[col].push(simCard);
 } else {
 simCols[col].unshift(simCard);
 }

 const matches = findMatches(simCols);
 if (matches.matchedIds.length > 0) {
 score += 1000 + matches.matchedIds.length * 100;
 return score; // Don't care about vulnerability if we can score now!
 }

 // Check vulnerability: Can the NEXT player make a match easily?
 let isVulnerable = false;
 const testColors = ['red', 'blue', 'green', 'yellow'];
 for (let c = 0; c < 3; c++) {
 for (let t of ['top', 'bottom']) {
 const actualTestT = currentState.gravity === 'reverse' ? (t === 'top' ? 'bottom' : 'top') : t;
 for (let color of testColors) {
 let testCols = simCols.map(c2 => [...c2]);
 if (actualTestT === 'top') {
 testCols[c].push({ id: 'test', color });
 } else {
 testCols[c].unshift({ id: 'test', color });
 }
 if (findMatches(testCols).matchedIds.length > 0) {
 isVulnerable = true;
 break;
 }
 }
 if (isVulnerable) break;
 }
 if (isVulnerable) break;
 }

 if (isVulnerable) {
 score -= 500;
 }
 
 score -= simCols[col].length;
 if (card.color === 'ojama') score += 50;
 
 return score;
 };

 for (let i = 0; i < hand.length; i++) {
 const card = hand[i];
 if (card.color === 'gravity' || card.color === 'tornado') {
 const s = evaluateMove(i, 0, 'top', undefined);
 if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i }]; }
 else if (s === maxScore) bestMoves.push({ cardIdx: i });
 } else {
 for (let col of availableCols) {
 for (let entry of ['top', 'bottom']) {
 if (card.color === 'chameleon') {
 for (let cc of ['red', 'blue', 'green', 'yellow']) {
 const s = evaluateMove(i, col, entry, cc);
 if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i, col, entry, chameleonColor: cc }]; }
 else if (s === maxScore) bestMoves.push({ cardIdx: i, col, entry, chameleonColor: cc });
 }
 } else {
 const s = evaluateMove(i, col, entry, undefined);
 if (s > maxScore) { maxScore = s; bestMoves = [{ cardIdx: i, col, entry }]; }
 else if (s === maxScore) bestMoves.push({ cardIdx: i, col, entry });
 }
 }
 }
 }
 }

 const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
 const randomCardIdx = chosenMove.cardIdx;
 const cardToPlayBase = hand[randomCardIdx];
 const randomCol = chosenMove.col !== undefined ? chosenMove.col : availableCols[0];
 const randomType = chosenMove.entry !== undefined ? chosenMove.entry : 'top';
 const chosenChameleonColor = chosenMove.chameleonColor;
 
 if (cardToPlayBase.color === 'gravity' || cardToPlayBase.color === 'tornado') {
 let newPlayers = [...currentState.players];
 newPlayers = recordSpecialCardUse(newPlayers, currentState.currentPlayerIndex, cardToPlayBase);
 let newDeck = [...currentState.deck];
 
 if (cardToPlayBase.color === 'gravity') {
 newPlayers[currentState.currentPlayerIndex] = {
 ...currentActivePlayer,
 hand: hand.filter((_, i) => i !== randomCardIdx)
 };
 const newColumns = currentState.columns.map(col => [...col].reverse());
 updateState({
 ...currentState,
 columns: newColumns,
 players: newPlayers,
 gravity: currentState.gravity === 'normal' ? 'reverse' : 'normal',
 status: 'animating_gravity',
 comboCount: 0,
 comboOwnerIndex: currentState.currentPlayerIndex,
 lastAction: undefined,
 activeActionCard: { type: 'gravity', playerName: currentActivePlayer.name }
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
 newPlayers = newPlayers.map((p, idx) => {
 const newHand = [];
 let cardsToDeal = currentState.players[idx].hand.length;
 if (idx === currentState.currentPlayerIndex) cardsToDeal -= 1;
 
 for (let i = 0; i < cardsToDeal; i++) {
 if (allCards.length > 0) newHand.push(allCards.pop());
 }
 return { ...p, hand: newHand };
 });
 const newState = { ...currentState, players: newPlayers, deck: newDeck, status: 'animating_tornado', activeActionCard: { type: 'tornado', playerName: currentActivePlayer.name } as any };
 updateState(newState);
 }
 return;
 }
 
 playDrop();
 const cardToPlay = { ...cardToPlayBase, entry: randomType as 'top' | 'bottom' };
 if (cardToPlay.color === 'chameleon' && chosenChameleonColor) {
 cardToPlay.chameleonColor = chosenChameleonColor;
 } else if (cardToPlay.color === 'chameleon') { 
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
 comboOwnerIndex: currentState.currentPlayerIndex
 });
 }, 1500);
 
 return () => clearTimeout(timer);
 }, [gameState.status, gameState.currentPlayerIndex, isHost, isCpuTurn, isPaused]);

 const handleActionCardUse = (action: 'gravity' | 'tornado') => {
 if (gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null) return;
 const hand = activePlayer.hand;
 let newPlayers = [...gameState.players];
 newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);
 let newDeck = [...gameState.deck];
 
 if (action === 'gravity') {
 playSpecial('gravity');
 newPlayers[gameState.currentPlayerIndex] = {
 ...activePlayer,
 hand: hand.filter((_, i) => i !== selectedCardIdx)
 };
 const newColumns = gameState.columns.map(col => [...col].reverse());
 updateState({
 ...gameState,
 columns: newColumns,
 players: newPlayers,
 gravity: gameState.gravity === 'normal' ? 'reverse' : 'normal',
 status: 'animating_gravity',
 comboCount: 0,
 comboOwnerIndex: gameState.currentPlayerIndex,
 lastAction: undefined,
 activeActionCard: { type: 'gravity', playerName: activePlayer.name }
 });
 setSelectedCardIdx(null);
 } else if (action === 'tornado') {
 playSpecial('tornado');
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
 newPlayers = newPlayers.map((p, idx) => {
 const newHand = [];
 let cardsToDeal = gameState.players[idx].hand.length;
 if (idx === gameState.currentPlayerIndex) cardsToDeal -= 1;
 
 for (let i = 0; i < cardsToDeal; i++) {
 if (allCards.length > 0) {
 newHand.push(allCards.pop());
 }
 }
 return { ...p, hand: newHand };
 });
 const newState = {
 ...gameState,
 players: newPlayers,
 deck: newDeck,
 activeActionCard: { type: 'tornado', playerName: activePlayer.name } as any
 };
 endTurn(newState, updateState);
 setSelectedCardIdx(null);
 }
 };

 const handleColumnClick = (colIdx: number, actionType: 'top' | 'bottom') => {
 if (gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null) return;
 
 const hand = activePlayer.hand;
 const cColor = hand[selectedCardIdx].color;
 if (cColor === 'ojama') playSpecial('ojama');
 else if (cColor === 'chameleon') playSpecial('chameleon');
 else playDrop();
 if (hand[selectedCardIdx].color === 'gravity' || hand[selectedCardIdx].color === 'tornado') return;
 const isChameleon = hand[selectedCardIdx].color === 'chameleon';
 let chosenColor = chameleonColor;
 if (isChameleon && !chosenColor) {
 const cols = ['red', 'blue', 'green', 'yellow'];
 chosenColor = cols[Math.floor(Math.random() * cols.length)] as any;
 }
 const cardToPlay = { ...hand[selectedCardIdx], entry: actionType, chameleonColor: chosenColor || undefined };
 
 let newDeck = [...gameState.deck];
 let newPlayers = [...gameState.players];
 newPlayers = recordSpecialCardUse(newPlayers, gameState.currentPlayerIndex, hand[selectedCardIdx]);
 newPlayers[gameState.currentPlayerIndex] = {
 ...newPlayers[gameState.currentPlayerIndex],
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
 deck: newDeck,
 columns: newColumns,
 lastAction: { col: colIdx, type: actionType },
 status: 'animating_gravity',
 comboCount: 0,
 comboOwnerIndex: gameState.currentPlayerIndex
 });
 setSelectedCardIdx(null);
 };

 const maxColLength = Math.max(1, ...gameState.columns.map(c => c.length));
 
 // Calculate unscaled height:
 // Cards: maxColLength * 64px
 // Top + Bottom buttons + padding: ~120px
 const unscaledHeight = maxColLength * 64 + 140; 
 // We want to make sure it doesn't exceed boardHeight.
 // Maximum scale is 1.2 to avoid getting too large on big screens.
 const scaleFactor = Math.min(1.2, boardHeight / unscaledHeight);

 const GAME_WIDTH = 400;
 const GAME_HEIGHT = 800;
 const outerScale = Math.min(windowSize.w / GAME_WIDTH, windowSize.h / GAME_HEIGHT);

 return (
 <div className="flex items-center justify-center h-[100dvh] w-full bg-black overflow-hidden relative">
 <div 
 className="flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative shadow-2xl ring-1 ring-white/10"
 style={{
 width: GAME_WIDTH,
 height: GAME_HEIGHT,
 transform: `scale(${outerScale})`,
 transformOrigin: 'center center',
 flexShrink: 0
 }}
 >
 {/* Header Info */}
 <header className="p-2 flex w-full items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800 shrink-0 relative z-10">
 {/* Player Info */}
 <div className="flex w-full items-center justify-between gap-1">
 {gameState.players.map((p, idx) => (
 <div 
 key={p.id} 
 className={cn(
 "px-1.5 py-1 rounded-lg border transition-all relative overflow-hidden flex flex-col justify-center flex-1 min-w-0",
 gameState.currentPlayerIndex === idx 
 ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
 : "bg-slate-900/50 border-slate-800 opacity-70"
 )}
 >
 {gameState.currentPlayerIndex === idx && (
 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
 )}
 {/* Top Row: Name & Timer */}
 <div className="relative z-10 flex justify-between items-center w-full gap-1 mb-0.5">
 <div className="font-bold text-[10px] text-white truncate">
 {p.isCpu ? '🤖' : ''}{p.name}
 </div>
 <div className={cn("text-[10px] font-bold shrink-0", 
 gameState.currentPlayerIndex === idx 
 ? (gameState.timeLeft <= 3 ? "text-rose-400 animate-pulse" : "text-cyan-400")
 : "text-transparent"
 )}>
 {gameState.currentPlayerIndex === idx ? `${gameState.timeLeft}s` : '0s'}
 </div>
 </div>
 {/* Bottom Row: Score */}
 <div className="relative z-10 text-sm font-black text-amber-400 leading-none truncate">
 {p.score} <span className="text-[8px] text-amber-400/70 font-normal">pts</span>
 </div>
 </div>
 ))}
 </div>
 </header>

 {/* Floating turn points indicator */}
 <AnimatePresence>
 {gameState.turnGainedPoints && gameState.turnGainedPoints > 0 && (
 <motion.div
 initial={{ opacity: 0, y: -20, x: 20 }}
 animate={{ opacity: 1, y: 0, x: 0 }}
 exit={{ opacity: 0, y: -20, scale: 0.8 }}
 className="absolute top-[80px] right-6 z-40 bg-slate-800/90 border border-amber-500/50 p-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md flex flex-col items-end"
 >
 <span className="text-xs font-bold text-slate-400 mb-1">{gameState.turnGainedPointsPlayerName}</span>
 <span className="text-2xl font-black text-amber-400 drop-shadow-md">+{gameState.turnGainedPoints} pts</span>
 </motion.div>
 )}
 </AnimatePresence>

 
 {/* Action Card Overlay */}
 <AnimatePresence>
 {(gameState.status === "animating_gravity" || gameState.status === "animating_tornado") && gameState.activeActionCard && (
 <motion.div
 initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
 animate={{ opacity: 1, scale: 1, rotate: 0 }}
 exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
 className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-slate-950/20 backdrop-blur-[2px]"
 >
 <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(99,102,241,0.5)] text-center flex flex-col items-center">
 <span className="text-6xl mb-4">
 {gameState.activeActionCard.type === 'gravity' ? '🌌' : '🌪️'}
 </span>
 <h2 className="text-3xl font-black text-white mb-2 tracking-widest uppercase drop-shadow-md">
 {gameState.activeActionCard.type === 'gravity' ? 'GRAVITY REVERSE!' : 'TORNADO!'}
 </h2>
 <p className="text-indigo-300 font-bold text-lg">
 {gameState.activeActionCard.playerName} USED ACTION!
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <main className="flex-1 grid grid-cols-4 gap-0 w-full max-w-5xl mx-auto min-h-0">
 {/* Center Panel: Game Board */}
 <div className="col-span-3 flex flex-col justify-between items-center relative overflow-hidden py-2 h-full">
 {/* Gravity Indicator */}
 <AnimatePresence>
 {gameState.gravity === 'reverse' && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTIwIDEwbC0xMCAxMGgyMHMtMTAgMTB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] pointer-events-none z-0"
 />
 )}
 </AnimatePresence>
 {/* Combo Indicator */}
 <AnimatePresence>
 {gameState.comboCount > 1 && (
 <motion.div
 initial={{ opacity: 0, scale: 0.5, y: 50 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 1.5 }}
 className="absolute top-[20%] z-50 text-3xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] italic tracking-tighter"
 >
 {gameState.comboCount} 連鎖!!
 </motion.div>
 )}
 </AnimatePresence>
 
 {/* Scaled Game Board Tracks */}
 
<div ref={boardRef} className="flex-1 flex flex-col justify-end items-center w-full min-h-0 relative py-16">
 {/* Top Buttons Fixed */}
 <div className="flex justify-center gap-0 w-full shrink-0 z-20 absolute top-4 left-0 right-0 pointer-events-none">
 <div className="flex justify-center gap-0 pointer-events-auto" style={{ width: '192px', margin: '0 auto' }}>
 {[0, 1, 2].map((colIdx) => (
 <div key={`top-btn-fixed-${colIdx}`} className="flex justify-center w-[64px]">
 <button
 onClick={() => handleColumnClick(colIdx, 'top')}
 disabled={gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null}
 className={cn(
 "p-2 rounded-xl font-bold text-xs transition-all duration-300 z-50 w-full",
 gameState.status === 'playing' && isActiveLocal && selectedCardIdx !== null
 ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
 : "bg-slate-800/50 text-slate-600 border border-slate-700 cursor-not-allowed"
 )}
 title="上から乗せる"
 >
 ⬇️
 </button>
 </div>
 ))}
 </div>
 </div>

 <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
 <div 
 className="flex flex-col items-center p-2 bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md origin-center transition-transform duration-300 pointer-events-auto"
 style={{ transform: `scale(${scaleFactor})` }}
 >
<div className="flex justify-center gap-0 flex-1 min-h-[300px] overflow-hidden rounded-xl">
 {gameState.columns.map((col, colIdx) => (
 <motion.div 
 key={`track-${colIdx}`}
 className={cn(
 "relative flex gap-0 items-center w-[64px] h-full justify-start",
 gameState.gravity === 'reverse' ? 'flex-col' : 'flex-col-reverse',
 colIdx !== 0 && "border-l border-white/5",
 colIdx !== 2 && "border-r border-white/5"
 )}
 style={{ transformOrigin: gameState.gravity === 'normal' ? 'bottom' : 'top' }}
 animate={(() => {
 if (gameState.lastAction?.col !== colIdx) return { scaleY: 1, y: 0 };
 const type = gameState.lastAction.type;
 const isGravityDrop = (gameState.gravity === 'normal' && type === 'top') || (gameState.gravity === 'reverse' && type === 'bottom');
 return isGravityDrop ? { scaleY: [1, 0.9, 1.02, 1], y: 0 } : { scaleY: 1, y: 0 };
 })()}
 transition={gameState.lastAction?.col === colIdx ? { duration: 0.5, times: [0, 0.2, 0.5, 1], ease: "easeInOut" } : { type: 'spring', stiffness: 400, damping: 10 }}
 >
 <div className="absolute bottom-0 w-[64px] h-32 bg-indigo-500/10 blur-xl pointer-events-none" />
 
 <AnimatePresence mode="popLayout">
 {col.map((card, idx) => {
 const isOjama = card.color === 'ojama';
 const isConnectedTop = !isOjama && (gameState.gravity === 'reverse' ? col[idx - 1]?.color : col[idx + 1]?.color) === card.color;
 const isConnectedBottom = !isOjama && (gameState.gravity === 'reverse' ? col[idx + 1]?.color : col[idx - 1]?.color) === card.color;
 const isConnectedLeft = !isOjama && gameState.columns[colIdx - 1]?.[idx]?.color === card.color;
 const isConnectedRight = !isOjama && gameState.columns[colIdx + 1]?.[idx]?.color === card.color;
 return (
 <motion.div
 key={card.id}
 layout
 transition={{ type: "spring", stiffness: 400, damping: 25, mass: 1 }}
 className="w-[64px] h-[64px] flex justify-center items-center"
 style={{ zIndex: col.length - idx }}
 >
 <PuyoBlock 
 card={card} 
 isMatched={gameState.matchedIds?.includes(card.id)}
 connections={{ top: isConnectedTop, bottom: isConnectedBottom, left: isConnectedLeft, right: isConnectedRight }}
 />
 </motion.div>
 );
 })}
 </AnimatePresence>
 </motion.div>
 ))}
 </div>

 
 </div>
 </div>
</div>
 {/* Bottom Buttons Fixed */}
 <div className="flex justify-center gap-0 w-full shrink-0 z-20 absolute bottom-4 left-0 right-0 pointer-events-none">
 <div className="flex justify-center gap-0 pointer-events-auto" style={{ width: '192px', margin: '0 auto' }}>
 {[0, 1, 2].map((colIdx) => (
 <div key={`bottom-btn-fixed-${colIdx}`} className="flex justify-center w-[64px]">
 <button
 onClick={() => handleColumnClick(colIdx, 'bottom')}
 disabled={gameState.status !== 'playing' || !isActiveLocal || selectedCardIdx === null}
 className={cn(
 "p-2 rounded-xl font-bold text-xs transition-all duration-300 z-50 w-full",
 gameState.status === 'playing' && isActiveLocal && selectedCardIdx !== null
 ? "bg-amber-500/20 text-amber-300 border border-amber-400 hover:bg-amber-400 hover:text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
 : "bg-slate-800/50 text-slate-600 border border-slate-700 cursor-not-allowed"
 )}
 title="下から入れる"
 >
 ⬆️
 </button>
 </div>
 ))}
 </div>
 </div>
</div>
{/* Right Panel: Hand */}
 <aside className={cn("col-span-1 flex flex-col items-center py-4 px-2 border-l transition-colors duration-500", isActiveLocal && gameState.status === 'playing' ? "bg-indigo-700/50 border-l-cyan-400 shadow-[inset_15px_0_30px_-15px_rgba(34,211,238,0.4)]" : "bg-slate-900/20 border-l-slate-800/50")}>
 {/* Deck Info */}
 <div className="flex flex-col items-center p-2 bg-slate-800/40 rounded-xl border border-slate-700/50 shadow-inner text-center w-full mb-4 shrink-0">
 <div className="text-xl mb-1">🃏</div>
 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">山札</div>
 <div className="text-xl font-black text-indigo-300 drop-shadow-md">{gameState.deck.length}</div>
 </div>
 
 <div className="flex-1 flex flex-col items-center justify-center w-full">
 <div className="mb-4 h-[48px] flex flex-col items-center justify-center w-full">
 {isActiveLocal && gameState.status === 'playing' ? (
 <div className={cn("text-2xl font-black rounded-full w-12 h-12 flex items-center justify-center border-4 shrink-0", gameState.timeLeft <= 3 ? "text-rose-400 border-rose-500 animate-pulse" : "text-cyan-400 border-cyan-500")}>
 {gameState.timeLeft}
 </div>
 ) : null}
 </div>
 <div className="flex flex-col items-center justify-center gap-3 w-full">
 <AnimatePresence>
 {gameState.players.find(p => p.id === localPlayerId)?.hand.map((card, i) => (
 <div key={card.id} className="relative w-full flex justify-center">
 <TCGCard 
 card={selectedCardIdx === i && card.color === 'chameleon' && chameleonColor ? { ...card, color: chameleonColor } : card}
 selected={selectedCardIdx === i}
 onClick={() => {
 if (isActiveLocal && gameState.status === 'playing') {
 setSelectedCardIdx(selectedCardIdx === i ? null : i); setChameleonColor(null);
 }
 }}
 />
 {selectedCardIdx === i && card.color === 'chameleon' && (
 <div className="flex gap-1 bg-slate-900/80 p-1.5 rounded-full absolute -left-12 top-1/2 -translate-y-1/2 flex-col z-50">
 {(['red', 'blue', 'green', 'yellow'] as const).map(c => (
 <div 
 key={c}
 className={`w-6 h-6 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 ${chameleonColor === c ? 'border-white' : 'border-transparent'}`}
 style={{ backgroundColor: c === 'red' ? '#e11d48' : c === 'blue' ? '#0891b2' : c === 'green' ? '#059669' : '#d97706' }}
 onClick={(e) => { e.stopPropagation(); setChameleonColor(c); }}
 />
 ))}
 </div>
 )}
 {selectedCardIdx === i && (card.color === 'gravity' || card.color === 'tornado') && (
 <div className="flex gap-1 bg-slate-900/80 p-2 rounded-lg absolute -left-24 top-1/2 -translate-y-1/2 flex-col z-50">
 <button
 onClick={(e) => { e.stopPropagation(); handleActionCardUse(card.color); }}
 className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded shadow-lg whitespace-nowrap"
 >
 使用する
 </button>
 </div>
 )}
 </div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 
 <div className="mt-4 shrink-0 w-full">
 <button onClick={() => setIsOptionsOpen(true)} className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 w-full text-center leading-tight">
 <Settings size={18} />
 <span>オプション</span>
 </button>
 </div>
 </aside>


 {/* Options Overlay */}
 <AnimatePresence>
 {isOptionsOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
 >
 <motion.div
 initial={{ scale: 0.95, y: 20 }}
 animate={{ scale: 1, y: 0 }}
 exit={{ scale: 0.95, y: 20 }}
 className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-8 flex flex-col gap-8 shadow-2xl relative"
 >
 <div className="flex flex-col gap-2 text-center">
 <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
 <Settings size={24} className="text-indigo-400" /> オプション
 </h2>
 {mode === 'cpu' && (
 <p className="text-amber-400 text-xs font-bold bg-amber-950/50 py-1 px-3 rounded-full inline-block mx-auto">
 ゲームは一時停止中です
 </p>
 )}
 </div>

 <div className="flex flex-col gap-6">
 <div className="flex flex-col gap-2">
 <div className="flex justify-between items-center text-sm font-bold">
 <span className="text-slate-300">BGM 音量</span>
 <span className="text-indigo-400">{bgmVolume}</span>
 </div>
 <input 
 type="range" min="0" max="100" 
 value={bgmVolume}
 onChange={(e) => setBgmVolume(Number(e.target.value))}
 className="w-full accent-indigo-500"
 />
 </div>

 <div className="flex flex-col gap-2">
 <div className="flex justify-between items-center text-sm font-bold">
 <span className="text-slate-300">SE (効果音) 音量</span>
 <span className="text-indigo-400">{seVolume}</span>
 </div>
 <input 
 type="range" min="0" max="100" 
 value={seVolume}
 onChange={(e) => setSeVolume(Number(e.target.value))}
 className="w-full accent-indigo-500"
 />
 </div>
 </div>

 <div className="flex flex-col gap-3 mt-4">
 <button 
 onClick={() => setIsOptionsOpen(false)} 
 className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold transition-all shadow-lg"
 >
 戻る（ゲームを続ける）
 </button>
 <button 
 onClick={onExit} 
 className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-bold transition-all"
 >
 退出する（メインへ）
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Game Over Overlay */}
 {gameState.status === 'gameover' && (
 <ScoreBoard 
 gameState={gameState} 
 localPlayerId={localPlayerId} 
 onExit={onExit} 
 onPlayAgain={onPlayAgain} 
 isHost={isHost} 
 />
 )}
 </main>
 </div>
 </div>
 );
}
