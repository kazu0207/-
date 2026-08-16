const fs = require('fs');
let code = fs.readFileSync('src/OnlineGame.tsx', 'utf8');

code = code.replace(
  `    const cpuCount = room.cpuCount || 0;
    for (let i = 0; i < cpuCount; i++) {`,
  `    let cpuCount = room.cpuCount || 0;
    if (room.players.length + cpuCount > 4) {
      cpuCount = Math.max(0, 4 - room.players.length);
    }
    for (let i = 0; i < cpuCount; i++) {`
);

fs.writeFileSync('src/OnlineGame.tsx', code);
