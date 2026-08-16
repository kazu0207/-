import React from 'react';
import { useMultiplayerStore } from './store';
import Lobby from './Lobby';
import CpuGame from './CpuGame';
import OnlineGame from './OnlineGame';

export default function App() {
  const { mode, setMode, disconnect } = useMultiplayerStore();

  const handleExit = () => {
    disconnect();
    setMode('menu');
  };

  if (mode === 'cpu') {
    return <CpuGame onExit={handleExit} />;
  }

  if (mode === 'online') {
    return <OnlineGame onExit={handleExit} />;
  }

  return <Lobby />;
}
