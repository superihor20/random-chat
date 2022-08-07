import { NextFunction, Request, Response } from 'express';

import { LoggerService } from '../Logger/Logger.service';
import { RouteController } from '../Route/Route.controller';

import { AuthService } from './Auth.service';

export class AuthController extends RouteController {
  #authService: AuthService;

  constructor(authService: AuthService, loggerService: LoggerService) {
    super(loggerService);

    this.#authService = authService;
    this.bindRouter([
      { path: '/sign-up', method: 'post', func: this.signUp },
      { path: '/sign-in', method: 'get', func: this.signIn },
    ]);
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokens = await this.#authService.signUp(req.body);

      res.status(201).json(tokens);
    } catch (e) {
      next(e);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokens = await this.#authService.signIn(req.body);

      res.status(200).json(tokens);
    } catch (e) {
      next(e);
    }
  };
}
