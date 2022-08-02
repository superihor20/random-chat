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
import getRandomNumber from './utils/helpers/getRandomNumber';
import { MessageData } from './utils/type/message-data';

config();

const intervalTime = 1000 * 1;
const loggerService = new LoggerService();
const chat = new RandomMessages(messages, users, loggerService);
const myColor = `rgba (${getRandomNumber(255)}, ${getRandomNumber(255)}, ${getRandomNumber(255)})`;
const myId = 400; // TODO: ya potom ybery

const app = express();
const server = createServer(app);
const io = new SocketServer(server, configSocket);

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

io.on('connection', (socket) => {
  io.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const { type, data } = chat.getRandomMessage();

    io.emit(type, data);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    const messageData: MessageData = {
      type: ServerActionMessageTypes.CHAT_MESSAGE,
      data: {
        id: myId,
        message,
        user: {
          id: new Date().getTime(), // TODO: i eto toje potom ybery
          username: 'Me',
          color: myColor,
        },
      },
    };

    io.emit(ServerActionMessageTypes.CHAT_MESSAGE, messageData);
  });
});

server.listen(configDev.port, () => {
  loggerService.log(`Chat is running on port ${configDev.port}`);
});
