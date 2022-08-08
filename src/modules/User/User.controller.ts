import { NextFunction, Request, Response } from 'express';

import { LoggerService } from '../Logger/Logger.service';
import { RouteController } from '../Route/Route.controller';

import { UserService } from './User.service';

export class UserController extends RouteController {
  #userService: UserService;

  constructor(userService: UserService, loggerService: LoggerService) {
    super(loggerService);

    this.#userService = userService;
    this.bindRouter([
      { path: '/me', method: 'get', func: this.getUser },
      { path: '/update', method: 'patch', func: this.updateUser },
    ]);
  }

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userInfo = req.user;
      const user = await this.#userService.getUserWithoutPassword({
        id: userInfo.id,
      });

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userInfo = req.user;
      const user = await this.#userService.updateUser(userInfo.id, req.body);

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };
}
