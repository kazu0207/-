const fs = require('fs');
let code = fs.readFileSync('src/gameLogic.ts', 'utf8');

// Instead of uniform actionCount, let's make it an object
code = code.replace(/let normalCount = 15;\s*let actionCount = 5;[\s\S]*?\} else if \(numPlayers >= 4\) \{\s*normalCount = 30;\s*actionCount = 10;\s*\}/, 
`let normalCount = 15;
  let actionCounts = { ojama: 4, chameleon: 4, gravity: 3, tornado: 3 };
  
  if (numPlayers === 3) {
    normalCount = 20;
    actionCounts = { ojama: 6, chameleon: 6, gravity: 4, tornado: 4 };
  } else if (numPlayers >= 4) {
    normalCount = 25;
    actionCounts = { ojama: 8, chameleon: 8, gravity: 5, tornado: 5 };
  }`);

code = code.replace(/for \(const color of ACTION_COLORS\) \{\s*for \(let i = 0; i < actionCount; i\+\+\) \{\s*deck\.push\(\{ id: \`card-\$\{prefix\}-\$\{color\}-\$\{idCounter\+\+\}\`, color \}\);\s*\}\s*\}/,
`for (const color of ACTION_COLORS) {
    const count = actionCounts[color as keyof typeof actionCounts] || 4;
    for (let i = 0; i < count; i++) {
      deck.push({ id: \`card-\${prefix}-\${color}-\${idCounter++}\`, color });
    }
  }`);

fs.writeFileSync('src/gameLogic.ts', code);
