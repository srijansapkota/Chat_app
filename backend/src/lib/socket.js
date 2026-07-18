import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { config } from 'dotenv';


config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

export function getReceiverSocketId(userId) {
  if (!userId) return null;
  return userSocketMap[String(userId)] || null;
}


const userSocketMap = {}; 

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId
    ? String(socket.handshake.query.userId)
    : null;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };