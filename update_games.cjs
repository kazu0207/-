const fs = require('fs');

let cpu = fs.readFileSync('src/CpuGame.tsx', 'utf8');
cpu = cpu.replace(/matchedIds: \[\]/, "matchedIds: [], gravity: 'normal', timeLeft: 10");
fs.writeFileSync('src/CpuGame.tsx', cpu);

let online = fs.readFileSync('src/OnlineGame.tsx', 'utf8');
online = online.replace(/matchedIds: \[\]/, "matchedIds: [], gravity: 'normal', timeLeft: 10");
fs.writeFileSync('src/OnlineGame.tsx', online);
