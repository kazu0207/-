import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const rooms = new Map<string, any>();

  io.on("connection", (socket) => {
    socket.on("join_room", (roomId, playerName, userId) => {
      socket.join(roomId);
      let room = rooms.get(roomId);
      
      if (!room) {
        room = { id: roomId, players: [], status: "waiting", cpuCount: 0 };
        rooms.set(roomId, room);
      }
      
      const existingPlayer = room.players.find((p: any) => p.id === userId);
      
      if (existingPlayer) {
        existingPlayer.socketId = socket.id;
        existingPlayer.connected = true;
        // If reconnecting during game, send current state to this player specifically
        if (room.status === "playing" && room.gameState) {
          socket.emit("sync_state", room.gameState);
        }
      } else if (room.players.length < 4 && room.status === "waiting") {
        room.players.push({
          id: userId,
          socketId: socket.id,
          name: playerName || `Player ${room.players.length + 1}`,
          ready: false,
          connected: true
        });
      }
      
      io.to(roomId).emit("room_update", room);
    });

    socket.on("player_ready", (roomId, isReady, userId) => {
      const room = rooms.get(roomId);
      if (room) {
        const player = room.players.find((p: any) => p.id === userId);
        if (player) {
          player.ready = isReady;
        }
        
        if (room.players.length >= 2 && room.players.every((p: any) => p.ready)) {
          room.status = "playing";
          io.to(roomId).emit("game_start", room);
        } else {
          io.to(roomId).emit("room_update", room);
        }
      }
    });

    socket.on("update_cpu_count", (roomId, cpuCount, userId) => {
      const room = rooms.get(roomId);
      if (room && room.players[0]?.id === userId) {
        room.cpuCount = cpuCount;
        io.to(roomId).emit("room_update", room);
      }
    });

    socket.on("sync_state", (roomId, state) => {
      const room = rooms.get(roomId);
      if (room) {
        room.gameState = state;
        socket.to(roomId).emit("sync_state", state);
      }
    });

    socket.on("leave_room", (roomId, userId) => {
      socket.leave(roomId);
      const room = rooms.get(roomId);
      if (room) {
        room.players = room.players.filter((p: any) => p.id !== userId);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("room_update", room);
        }
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        const player = room.players.find((p: any) => p.socketId === socket.id);
        if (player) {
          player.connected = false;
          io.to(roomId).emit("room_update", room);
        }
      });
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
