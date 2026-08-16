const fs = require('fs');
const emptyStatsStr = `stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }`;

const cpuCode = fs.readFileSync('src/CpuGame.tsx', 'utf8');
const newCpuCode = cpuCode
  .replace(/score: 0, hand: \[\] \}/g, `score: 0, hand: [], ${emptyStatsStr} }`)
  .replace(/score: 0, hand: \[\]/g, `score: 0, hand: [], ${emptyStatsStr}`);
fs.writeFileSync('src/CpuGame.tsx', newCpuCode);

const onlineCode = fs.readFileSync('src/OnlineGame.tsx', 'utf8');
const newOnlineCode = onlineCode
  .replace(/score: 0,\s*hand: \[\]/g, `score: 0, hand: [], ${emptyStatsStr}`);
fs.writeFileSync('src/OnlineGame.tsx', newOnlineCode);

