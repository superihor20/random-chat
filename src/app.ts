import http from 'http';

import { config } from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import { configurationDev } from './config/config.dev';
import { configSocket } from './config/config.socket';
import LoggerService from './modules/Logger/Logger.service';
import RandomMessages from './modules/RandomMessage/RandomMessage.service';
import { messages } from './utils/data/messages-data';
import { users } from './utils/data/users-data';
import { ServerActionMessageTypes, UserActionMessageTypes } from './utils/enums/message-types';

config();

const intervalTime = 1000 * 2;
const loggerService = new LoggerService();
const chat = new RandomMessages(messages, users, loggerService);

const app = express();
const server = http.createServer(app);
const io = new Server(server, configSocket);

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

io.on('connection', (socket) => {
  socket.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const randomMessage = chat.getRandomMessage();

    socket.emit(randomMessage.type, randomMessage);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    const messageData = {
      type: ServerActionMessageTypes.CHAT_MESSAGE,
      data: `Me: ${message}`,
    };

    socket.emit(ServerActionMessageTypes.CHAT_MESSAGE, messageData);
  });
});

server.listen(configurationDev.port, () => {
  loggerService.log(`Chat is running on port ${configurationDev.port}`);
});
