import http from 'http';

import { config } from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import LoggerService from './modules/Logger/Logger.service';
import RandomMessages from './modules/RandomMessage/RandomMessage.service';
import { messages } from './utils/data/messages-data';
import { users } from './utils/data/users-data';
import { ServerActionMessageTypes, UserActionMessageTypes } from './utils/enums/message-types';

config();

const intervalTime = 1000 * 2;
const port = process.env.PORT || 3000;
const clienUrl = process.env.CLIENT_URL || 'http://localhost:4200';
const loggerService = new LoggerService();
const chat = new RandomMessages(messages, users, loggerService);

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
  loggerService.log(`Socket connected successfully`);

  socket.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const randomMessage = chat.getRandomMessage();

    loggerService.log(`Message send`, randomMessage);

    socket.emit(randomMessage.type, randomMessage);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    loggerService.log(`Message received`, message);

    const messageData = {
      type: ServerActionMessageTypes.CHAT_MESSAGE,
      data: `Me: ${message}`,
    };

    socket.emit(ServerActionMessageTypes.CHAT_MESSAGE, messageData);

    loggerService.log(`Message from user send`, messageData);
  });
});

server.listen(port, () => {
  loggerService.log(`Chat is running on port ${port}`);
});
