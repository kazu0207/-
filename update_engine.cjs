const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. Add BGM useEffect
const useEffectStr = `
  useEffect(() => {
    if (gameState.status !== 'gameover') {
      startBgm();
    } else {
      stopBgm();
    }
    return () => stopBgm();
  }, [gameState.status]);
`;
// Insert after shouldExecuteLoop
const insertPoint = code.indexOf('const shouldExecuteLoop = isActiveLocal || (isHost && isCpuTurn);');
const nextLine = code.indexOf('\n', insertPoint);
code = code.slice(0, nextLine) + '\n' + useEffectStr + code.slice(nextLine);

// 2. Add playSpecial for gravity and tornado
code = code.replace(/if \(action === 'gravity'\) \{/g, "if (action === 'gravity') {\n      playSpecial('gravity');");
code = code.replace(/else if \(action === 'tornado'\) \{/g, "else if (action === 'tornado') {\n      playSpecial('tornado');");

// 3. Update handleColumnClick to play proper sound
const handleColumnClickRegex = /playDrop\(\);\s*const hand = activePlayer\.hand;/;
const newHandleColumnClick = `const hand = activePlayer.hand;
    const cColor = hand[selectedCardIdx].color;
    if (cColor === 'ojama') playSpecial('ojama');
    else if (cColor === 'chameleon') playSpecial('chameleon');
    else playDrop();`;
code = code.replace(handleColumnClickRegex, newHandleColumnClick);

fs.writeFileSync('src/GameEngine.tsx', code);
