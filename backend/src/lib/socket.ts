import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
import { config } from 'dotenv';

config();

const app = express();
const server = http.createServer(app);

const allowedOrigins: string[] = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

const userSocketMap: Record<string, string> = {};

export function getSocketId(userId?: string | null): string | null {
  if (!userId) return null;
  return userSocketMap[String(userId)] || null;
}

io.on('connection', (socket: Socket) => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId
    ? String(socket.handshake.query.userId)
    : null;

  socket.on('typing', ({ receiverId }: { receiverId: string }) => {
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit('typing', { senderId: userId });
  });

  socket.on('stopTyping', ({ receiverId }: { receiverId: string }) => {
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit('stopTyping', { senderId: userId });
  });

  if (userId) userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
