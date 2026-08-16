const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `import { ArrowUpDown, Tornado } from 'lucide-react';`,
  `import { ArrowUpDown, Tornado } from 'lucide-react';
import { ScoreBoard } from './ScoreBoard';`
);

const oldGameOverUIRegex = /\{gameState\.status === 'gameover' && \([\s\S]*?\)\}/;

const newGameOverUI = `{gameState.status === 'gameover' && (
          <ScoreBoard 
            gameState={gameState} 
            localPlayerId={localPlayerId} 
            onExit={onExit} 
            onPlayAgain={onPlayAgain} 
            isHost={isHost} 
          />
        )}`;

code = code.replace(oldGameOverUIRegex, newGameOverUI);

fs.writeFileSync('src/GameEngine.tsx', code);
