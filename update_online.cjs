const fs = require('fs');
let data = fs.readFileSync('src/OnlineGame.tsx', 'utf8');

data = data.replace(
  /const \{ room, socket, syncState \} = useMultiplayerStore\(\);/,
  `const { room, socket, syncState, userId } = useMultiplayerStore();`
);

data = data.replace(
  /const isHost = room\.players\[0\]\?\.id === socket\.id;/g,
  `const isHost = room.players[0]?.id === userId;`
);

data = data.replace(
  /socket\?\.id/g,
  `userId`
);

data = data.replace(
  /socket\.id/g,
  `userId`
);

fs.writeFileSync('src/OnlineGame.tsx', data);
