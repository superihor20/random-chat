import { createServer } from 'http';

import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

import { AppDataSource } from './configs/config.db';
import { configDev } from './configs/config.dev';
import { configSocket } from './configs/config.socket';
import { AuthController } from './modules/Auth/Auth.controller';
import { AuthService } from './modules/Auth/Auth.service';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';
import { RandomMessages } from './modules/RandomMessage/RandomMessage.service';
import { UserService } from './modules/User/User.service';
import { messages } from './utils/data/messages';
import { users } from './utils/data/users';
import { ServerActionMessageTypes, UserActionMessageTypes } from './utils/enums/message-types';
import { getRandomNumber } from './utils/helpers/getRandomNumber';
import { Message } from './utils/types/message';

config();

const intervalTime = 1000 * 1;
const loggerService = new LoggerService();
const chat = new RandomMessages(messages, users, loggerService);
const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);
const errorService = new ErrorService(loggerService);
const myColor = `rgba (${getRandomNumber(255)}, ${getRandomNumber(255)}, ${getRandomNumber(255)})`;
const myId = 400; // TODO: ya potom ybery

const app = express();
const server = createServer(app);
const io = new SocketServer(server, configSocket);

AppDataSource.initialize()
  .then(() => {
    loggerService.log(`DB connected successfully`);
  })
  .catch((e) => {
    loggerService.error(e.message);
  });

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.send("Chat ebat'!");
});

app.post('/auth/sign-up', authController.signUp);

io.on('connection', (socket) => {
  io.emit(UserActionMessageTypes.HELLO_ACTION, "I'm in da house");

  setInterval(() => {
    const { type, data } = chat.getRandomMessage();

    io.emit(type, data);
  }, intervalTime);

  socket.on(UserActionMessageTypes.MY_MESSAGE, (message) => {
    const messageData: Message = {
      id: myId,
      message,
      user: {
        id: new Date().getTime(), // TODO: i eto toje potom ybery
        username: 'Me',
        color: myColor,
      },
    };

    io.emit(ServerActionMessageTypes.CHAT_MESSAGE, messageData);
  });
});

app.use(errorService.catch);

server.listen(configDev.port, () => {
  loggerService.log(`Chat is running on port ${configDev.port}`);
});
