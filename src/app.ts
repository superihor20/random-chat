import http from 'http';

import { config } from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import Chat from './controllers/Сhat';
import { messages } from './utils/data/messages-data';
import { users } from './utils/data/users-data';
import { ServerActionMessageTypes, UserActionMessageTypes } from './utils/enums/message-types';

config();

const intervalTime = 1000 * 2;
const port = process.env.PORT || 3000;
const clienUrl = process.env.CLIENT_URL || 'http://localhost:4200';
const chat = new Chat(messages, users);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/',
  cors: {
    origin: clienUrl,
  },
});

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

io.on('connection', (socket) => {
  console.log('Successful connection');

  socket.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const randomMessage = chat.getRandomMessage();

    socket.emit(randomMessage.type, randomMessage);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    socket.emit(ServerActionMessageTypes.CHAT_MESSAGE, {
      type: ServerActionMessageTypes.CHAT_MESSAGE,
      data: `Me: ${message}`,
    });
  });
});

server.listen(port, () => {
  console.log(`Chat is running on port ${port}`);
});
