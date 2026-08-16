const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const bgmEffectRegex = /useEffect\(\(\) => \{\s*if \(gameState\.status !== 'gameover'\) \{\s*startBgm\(\);\s*\} else \{\s*stopBgm\(\);\s*\}\s*return \(\) => stopBgm\(\);\s*\}, \[gameState\.status\]\);/;

const newBgmEffect = `useEffect(() => {
    if (gameState.status !== 'gameover') {
      startBgm();
    } else {
      stopBgm();
    }
  }, [gameState.status]);

  useEffect(() => {
    return () => stopBgm();
  }, []);`;

code = code.replace(bgmEffectRegex, newBgmEffect);

fs.writeFileSync('src/GameEngine.tsx', code);
