import { App } from './app';
import { AppDataSource } from './configs/config.db';
import { AuthController } from './modules/Auth/Auth.controller';
import { AuthService } from './modules/Auth/Auth.service';
import { ErrorService } from './modules/Error/Error.service';
import { LoggerService } from './modules/Logger/Logger.service';
import { TokenService } from './modules/Token/Token.service';
import { UserController } from './modules/User/User.controller';
import { UserService } from './modules/User/User.service';

const runApp = (): void => {
  const tokenService = new TokenService();
  const loggerService = new LoggerService();
  const errorService = new ErrorService(loggerService);
  const userService = new UserService();
  const authService = new AuthService(tokenService, userService);

  const authController = new AuthController(authService, loggerService);
  const userController = new UserController(userService, loggerService);

  const app = new App(loggerService, errorService, AppDataSource, authController, userController);

  app.initialize();
};

runApp();
