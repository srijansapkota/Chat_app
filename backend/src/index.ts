import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path from 'path';
import fs from 'fs';

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const allowedOrigins: string[] = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const frontendDistPath = path.join(__dirname, '../frontend/dist');

if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
};

startServer();
