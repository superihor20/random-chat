import { createServer, Server } from 'http';

import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../swagger.json';

import { AppDataSource } from './configs/config.db';
import { configDev } from './configs/config.dev';
import { AuthController } from './modules/Auth/Auth.controller';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';

config();

export class App {
  server: Server;

  express: Express;

  errorService: ErrorService;

  loggerService: LoggerService;

  authController: AuthController;

  appDataSource: typeof AppDataSource;

  constructor(
    loggerService: LoggerService,
    errorService: ErrorService,
    appDataSource: typeof AppDataSource,
    authController: AuthController
  ) {
    this.express = express();
    this.server = createServer(this.express);
    this.errorService = errorService;
    this.loggerService = loggerService;
    this.authController = authController;
    this.appDataSource = appDataSource;
  }

  #initializeDbConnection = async (): Promise<void> => {
    try {
      await this.appDataSource.initialize();
      this.loggerService.log(`DB connected successfully`);
    } catch (e) {
      this.loggerService.error((e as Error).message);
    }
  };

  #useConfiguration = (): void => {
    this.express.use(bodyParser.json());
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  };

  #useRoutes = (): void => {
    this.express.use('/auth', this.authController.router);
  };

  #useError = (): void => {
    this.express.use(this.errorService.catch);
  };

  initialize = async (): Promise<void> => {
    await this.#initializeDbConnection();
    this.#useConfiguration();
    this.#useRoutes();
    this.#useError();

    this.server.listen(configDev.port, () => {
      this.loggerService.log(`Chat is running on port ${configDev.port}`);
    });
  };
}
