const fs = require('fs');
let code = fs.readFileSync('src/gameLogic.ts', 'utf8');

const regex = /let normalCount = 15;[\s\S]*?let actionCounts = \{ ojama: 4, chameleon: 4, gravity: 3, tornado: 3 \};[\s\S]*?if \(numPlayers === 3\) \{[\s\S]*?normalCount = 20;[\s\S]*?actionCounts = \{ ojama: 6, chameleon: 6, gravity: 4, tornado: 4 \};[\s\S]*?\} else if \(numPlayers >= 4\) \{[\s\S]*?normalCount = 25;[\s\S]*?actionCounts = \{ ojama: 8, chameleon: 8, gravity: 5, tornado: 5 \};[\s\S]*?\}/;

const newCode = `let normalCount = 15;
  let actionCount = 5;
  
  if (numPlayers === 3) {
    normalCount = 24;
    actionCount = 8;
  } else if (numPlayers >= 4) {
    normalCount = 30;
    actionCount = 10;
  }`;

code = code.replace(regex, newCode);

const regex2 = /for \(const color of ACTION_COLORS\) \{[\s\S]*?const count = actionCounts\[color as keyof typeof actionCounts\] \|\| 4;[\s\S]*?for \(let i = 0; i < count; i\+\+\) \{/;
const newCode2 = `for (const color of ACTION_COLORS) {
    for (let i = 0; i < actionCount; i++) {`;

code = code.replace(regex2, newCode2);

fs.writeFileSync('src/gameLogic.ts', code);
