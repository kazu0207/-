const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// CPU logic
code = code.replace(
  /if \(randomType === 'top'\) \{\s*newColumns\[randomCol\] = \[\.\.\.newColumns\[randomCol\], cardToPlay\];\s*\} else \{\s*newColumns\[randomCol\] = \[cardToPlay, \.\.\.newColumns\[randomCol\]\];\s*\}/g,
  `const actualActionType = currentState.gravity === 'reverse' ? (randomType === 'top' ? 'bottom' : 'top') : randomType;
      if (actualActionType === 'top') {
        newColumns[randomCol] = [...newColumns[randomCol], cardToPlay];
      } else {
        newColumns[randomCol] = [cardToPlay, ...newColumns[randomCol]];
      }`
);

// handleColumnClick logic
code = code.replace(
  /let newColumns = \[\.\.\.gameState\.columns\];\s*if \(actionType === 'top'\) \{\s*newColumns\[colIdx\] = \[\.\.\.newColumns\[colIdx\], cardToPlay\];\s*\} else \{\s*newColumns\[colIdx\] = \[cardToPlay, \.\.\.newColumns\[colIdx\]\];\s*\}/g,
  `let newColumns = [...gameState.columns];
    const actualActionType = gameState.gravity === 'reverse' ? (actionType === 'top' ? 'bottom' : 'top') : actionType;
    if (actualActionType === 'top') {
      newColumns[colIdx] = [...newColumns[colIdx], cardToPlay];
    } else {
      newColumns[colIdx] = [cardToPlay, ...newColumns[colIdx]];
    }`
);

fs.writeFileSync('src/GameEngine.tsx', code);
