const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Remove duplicate import
code = code.replace("import { useRef } from 'react';\n\nexport function GameEngine({", "export function GameEngine({");

// Add gameStateRef
code = code.replace(
  "const [chameleonColor, setChameleonColor] = useState<'red'|'blue'|'green'|'yellow' | null>(null);",
  `const [chameleonColor, setChameleonColor] = useState<'red'|'blue'|'green'|'yellow' | null>(null);
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);`
);

fs.writeFileSync('src/GameEngine.tsx', code);
