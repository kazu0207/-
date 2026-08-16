const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  `        {/* Game Over Overlay */}
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
  );
}`,
  `        {/* Game Over Overlay */}
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
}`
);

fs.writeFileSync('src/GameEngine.tsx', code);
