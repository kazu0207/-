const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const replacement = `  lastAction?: { col: number, type: 'top' | 'bottom' };
  activeActionCard?: { type: 'gravity' | 'tornado', playerName: string };`;

code = code.replace("  lastAction?: { col: number, type: 'top' | 'bottom' };", replacement);
fs.writeFileSync('src/types.ts', code);
