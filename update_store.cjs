const fs = require('fs');
let data = fs.readFileSync('src/store.ts', 'utf8');

data = data.replace(
  /disconnect: \(\) => \{[\s\S]*?setReady: \(ready\) => \{[\s\S]*?socket\.emit\('player_ready', roomId, ready\);\s*\}\s*\}/,
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
