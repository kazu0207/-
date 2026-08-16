const fs = require('fs');
let data = fs.readFileSync('src/store.ts', 'utf8');

data = data.replace(
  /disconnect: \(\) => \{\s*const \{ socket, roomId \} = get\(\);\s*if \(socket\) \{\s*if \(roomId\) socket\.emit\('leave_room', roomId\);\s*socket\.disconnect\(\);\s*\}\s*set\(\{ socket: null, roomId: null, room: null \}\);\s*\},\s*setReady: \(ready\) => \{\s*const \{ socket, roomId \} = get\(\);\s*if \(socket && roomId\) \{\s*socket\.emit\('player_ready', roomId, ready\);\s*\}\s*\}/g,
  `disconnect: () => {
    const { socket, roomId, userId } = get();
    if (socket) {
      if (roomId) socket.emit('leave_room', roomId, userId);
      socket.disconnect();
    }
    set({ socket: null, roomId: null, room: null });
  },
  setReady: (ready) => {
    const { socket, roomId, userId } = get();
    if (socket && roomId) {
      socket.emit('player_ready', roomId, ready, userId);
    }
  }`
);

fs.writeFileSync('src/store.ts', data);
