import { App } from './App';
import { AppDataSource } from './configs/config.db';
import { AuthController } from './modules/Auth/Auth.controller';
import { AuthService } from './modules/Auth/Auth.service';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';
import { UserService } from './modules/User/User.service';

const runApp = (): void => {
  const loggerService = new LoggerService();
  const errorService = new ErrorService(loggerService);
  const userService = new UserService();
  const authService = new AuthService(userService);

  const authController = new AuthController(authService, loggerService);

  const app = new App(loggerService, errorService, AppDataSource, authController);

  app.initialize();
};

runApp();
