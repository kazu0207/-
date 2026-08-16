const fs = require('fs');
let code = fs.readFileSync('src/CpuGame.tsx', 'utf8');

const regex = /score: 0,\s*hand: \[\]\s*\}\);/g;
const replacement = `score: 0,
        hand: [],
        stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
      });`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/CpuGame.tsx', code);
