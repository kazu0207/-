import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { GameState } from './types';

interface Player {
  id: string;
  name: string;
  ready: boolean;
  connected: boolean;
}

interface Room {
  id: string;
  status: 'waiting' | 'playing';
  players: Player[];
  gameState?: GameState;
  cpuCount?: number;
}

const getInitialPlayerName = () => {
  let name = localStorage.getItem('puyo_player_name');
  if (!name) {
    name = `Player ${Math.floor(Math.random() * 1000)}`;
  }
  return name;
};

const generateUserId = () => {
  let uid = localStorage.getItem('puyo_user_id');
  if (!uid) {
    uid = Math.random().toString(36).substring(2, 10);
    localStorage.setItem('puyo_user_id', uid);
  }
  return uid;
};

interface MultiPlayerStore {
  socket: Socket | null;
  userId: string;
  roomId: string | null;
  room: Room | null;
  mode: 'menu' | 'cpu' | 'online';
  playerName: string;
  bgmVolume: number;
  seVolume: number;
  error: string | null;
  setMode: (mode: 'menu' | 'cpu' | 'online') => void;
  setPlayerName: (name: string) => void;
  setBgmVolume: (vol: number) => void;
  setSeVolume: (vol: number) => void;
  connectAndJoin: (roomId: string) => void;
  disconnect: () => void;
  setReady: (ready: boolean) => void;
  setCpuCount: (count: number) => void;
  syncState: (state: GameState) => void;
  onGameStart: ((room: Room) => void) | null;
  onSyncState: ((state: GameState) => void) | null;
  registerCallbacks: (
    onStart: (room: Room) => void,
    onSync: (state: GameState) => void
  ) => void;
}

export const useMultiplayerStore = create<MultiPlayerStore>((set, get) => ({
  socket: null,
  userId: generateUserId(),
  roomId: null,
  room: null,
  mode: 'menu',
  playerName: getInitialPlayerName(),
  bgmVolume: Number(localStorage.getItem('puyo_bgm_vol') ?? 50),
  seVolume: Number(localStorage.getItem('puyo_se_vol') ?? 50),
  error: null,
  onGameStart: null,
  onSyncState: null,
  setMode: (mode) => set({ mode }),
  setBgmVolume: (bgmVolume) => {
    localStorage.setItem('puyo_bgm_vol', String(bgmVolume));
    set({ bgmVolume });
  },
  setSeVolume: (seVolume) => {
    localStorage.setItem('puyo_se_vol', String(seVolume));
    set({ seVolume });
  },
  setPlayerName: (playerName) => {
    localStorage.setItem('puyo_player_name', playerName);
    set({ playerName });
  },
  
  registerCallbacks: (onStart, onSync) => set({
    onGameStart: onStart,
    onSyncState: onSync
  }),

  connectAndJoin: (roomId) => {
    const { socket, playerName, userId } = get();
    if (socket) {
      socket.disconnect();
    }
    
    const newSocket = io();
    
    newSocket.on('connect', () => {
      newSocket.emit('join_room', roomId, playerName, userId);
    });

    newSocket.on('room_update', (room: Room) => {
      set({ room });
    });
    
    newSocket.on('game_start', (room: Room) => {
      set({ room });
      const onStart = get().onGameStart;
      if (onStart) onStart(room);
    });
    
    newSocket.on('sync_state', (state: GameState) => {
      const room = get().room;
      if (room) {
        set({ room: { ...room, gameState: state } });
      }
      const onSync = get().onSyncState;
      if (onSync) onSync(state);
    });

    set({ socket: newSocket, roomId });
  },

  disconnect: () => {
    const { socket, roomId, userId } = get();
    if (socket) {
      if (roomId) socket.emit('leave_room', roomId, userId);
      socket.disconnect();
    }
    set({ socket: null, roomId: null, room: null });
  },
  setCpuCount: (count) => {
    const { socket, roomId, userId } = get();
    if (socket && roomId) {
      socket.emit('update_cpu_count', roomId, count, userId);
    }
  },
  setReady: (ready) => {
    const { socket, roomId, userId } = get();
    if (socket && roomId) {
      socket.emit('player_ready', roomId, ready, userId);
    }
  },

  syncState: (state) => {
    const { socket, roomId, room } = get();
    if (socket && roomId) {
      socket.emit('sync_state', roomId, state);
    }
    // Optimistic update locally
    if (room) {
      set({ room: { ...room, gameState: state } });
    }
    const onSync = get().onSyncState;
    if (onSync) onSync(state);
  }
}));
