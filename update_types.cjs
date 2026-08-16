const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const newCode = `export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'ojama' | 'chameleon' | 'gravity' | 'tornado';

export interface PlayerStats {
  maxCombo: number;
  linesCleared: number;
  maxSimultaneousLines: number;
  blocksCleared: {
    total: number;
    ojama: number;
    red: number;
    blue: number;
    green: number;
    yellow: number;
  };
  specialCardsUsed: {
    total: number;
    gravity: number;
    tornado: number;
    chameleon: number;
    ojama: number;
  };
}

export interface GameCard {
  id: string;
  color: CardColor;
  chameleonColor?: 'red' | 'blue' | 'green' | 'yellow';
  entry?: 'top' | 'bottom';
}

export interface PlayerState {
  id: string;
  name: string;
  isCpu: boolean;
  score: number;
  hand: GameCard[];
  stats: PlayerStats;
}

export interface GameState {
  deck: GameCard[];
  columns: GameCard[][];
  players: PlayerState[];
  currentPlayerIndex: number;
  status: 'playing' | 'animating_match' | 'animating_gravity' | 'gameover';
  winnerId: string | null;
  comboOwnerIndex?: number;
  comboCount: number;
  matchedIds: string[];
  gravity: 'normal' | 'reverse';
  timeLeft: number;
  pendingPoints?: number;
  turnGainedPoints?: number;
  turnGainedPointsPlayerName?: string;
  lastAction?: { col: number, type: 'top' | 'bottom' };
  activeActionCard?: { type: 'gravity' | 'tornado', playerName: string };
}
`;
fs.writeFileSync('src/types.ts', newCode);
