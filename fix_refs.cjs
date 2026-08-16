const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(
  "export function GameEngine({",
  `import { useRef } from 'react';\n\nexport function GameEngine({`
);

code = code.replace(
  "  const [chameleonColor, setChameleonColor] = useState<CardColor | null>(null);",
  `  const [chameleonColor, setChameleonColor] = useState<CardColor | null>(null);
  
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);`
);

// Fix timer interval
code = code.replace(
  /const timer = setInterval\(\(\) => \{[\s\S]*?\}, 1000\);\n    return \(\) => clearInterval\(timer\);\n  \}, \[gameState\.status, gameState\.timeLeft, shouldExecuteLoop\]\);/,
  `const timer = setInterval(() => {
      const currentState = gameStateRef.current;
      if (currentState.timeLeft > 0) {
        updateState({ ...currentState, timeLeft: currentState.timeLeft - 1 });
      } else {
        // Auto-pass turn
        endTurn(currentState, updateState);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.status, shouldExecuteLoop]);`
);

fs.writeFileSync('src/GameEngine.tsx', code);
