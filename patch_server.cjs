const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target1 = `        room = { id: roomId, players: [], status: "waiting" };`;
const repl1 = `        room = { id: roomId, players: [], status: "waiting", cpuCount: 0 };`;
code = code.replace(target1, repl1);

const target2 = `    socket.on("sync_state", (roomId, state) => {`;
const repl2 = `    socket.on("update_cpu_count", (roomId, cpuCount, userId) => {
      const room = rooms.get(roomId);
      if (room && room.players[0]?.id === userId) {
        room.cpuCount = cpuCount;
        io.to(roomId).emit("room_update", room);
      }
    });

    socket.on("sync_state", (roomId, state) => {`;
code = code.replace(target2, repl2);

fs.writeFileSync('server.ts', code);
