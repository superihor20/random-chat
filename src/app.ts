import { createServer } from 'http';

import { config } from 'dotenv';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

import { configDev } from './config/config.dev';
import { configSocket } from './config/config.socket';
import LoggerService from './modules/Logger/Logger.service';
import RandomMessages from './modules/RandomMessage/RandomMessage.service';
import { messages } from './utils/data/messages-data';
import { users } from './utils/data/users-data';
import { ServerActionMessageTypes, UserActionMessageTypes } from './utils/enums/message-types';

config();

const intervalTime = 1000 * 1;
const loggerService = new LoggerService();
const chat = new RandomMessages(messages, users, loggerService);

const app = express();
const server = createServer(app);
const io = new SocketServer(server, configSocket);

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

io.on('connection', (socket) => {
  io.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const randomMessage = chat.getRandomMessage();

    io.emit(randomMessage.type, randomMessage);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    const messageData = {
      type: ServerActionMessageTypes.CHAT_MESSAGE,
      data: `Me: ${message}`,
    };

    io.emit(ServerActionMessageTypes.CHAT_MESSAGE, messageData);
  });
});

server.listen(configDev.port, () => {
  loggerService.log(`Chat is running on port ${configDev.port}`);
});
