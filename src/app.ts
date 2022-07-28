import express from 'express';
import http from 'http';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import { getRandomMesage } from './utils/helpers/getRandomMesage';

config();

getRandomMesage();
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/',
  cors: {
    origin: 'http://localhost:4200',
  },
});

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('hello', (msg) => {
    console.log(msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Chat is running on port ${port}`);
});
