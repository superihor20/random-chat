import { createServer } from 'http';

import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../swagger.json';

import { AppDataSource } from './configs/config.db';
import { configDev } from './configs/config.dev';
import authRouter from './modules/Auth/Auth.router';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';

config();

const loggerService = new LoggerService();
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

app.use('/auth', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorService.catch);

server.listen(configDev.port, () => {
  loggerService.log(`Chat is running on port ${configDev.port}`);
});
