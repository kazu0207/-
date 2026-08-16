const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// Fix CPU logic
code = code.replace(/updateState\(\{\s*columns: newColumns,\s*\.\.\.currentState,/g, "updateState({\n            ...currentState,\n            columns: newColumns,");

// Fix Player logic
code = code.replace(/updateState\(\{\s*columns: newColumns,\s*\.\.\.gameState,/g, "updateState({\n        ...gameState,\n        columns: newColumns,");

fs.writeFileSync('src/GameEngine.tsx', code);
