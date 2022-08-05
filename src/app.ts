import { createServer } from 'http';

import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';

import { AppDataSource } from './configs/config.db';
import { configDev } from './configs/config.dev';
import { AuthController } from './modules/Auth/Auth.controller';
import { AuthService } from './modules/Auth/Auth.service';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';
import { UserService } from './modules/User/User.service';

config();

const loggerService = new LoggerService();
const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);
const errorService = new ErrorService(loggerService);

const app = express();
const server = createServer(app);

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

app.use(errorService.catch);

server.listen(configDev.port, () => {
  loggerService.log(`Chat is running on port ${configDev.port}`);
});
