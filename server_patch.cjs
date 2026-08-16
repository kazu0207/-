const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  /socket\.on\("player_state_update".*?\}\);/s,
  `socket.on("sync_state", (roomId, state) => {
      const room = rooms.get(roomId);
      if (room) {
        room.gameState = state;
        socket.to(roomId).emit("sync_state", state);
      }
    });`
);

fs.writeFileSync('server.ts', code);
