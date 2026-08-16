const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /\{gameState\.status === 'gameover' && \([\s\S]*?\)\}\s*<\/div>\s*<\/div>\s*\)\}\s*<\/main>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const newCode = `{gameState.status === 'gameover' && (
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
  );
}`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/GameEngine.tsx', code);
