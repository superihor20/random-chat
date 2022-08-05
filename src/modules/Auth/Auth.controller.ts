import { NextFunction, Request, Response } from 'express';

import { AuthService } from './Auth.service';

export class AuthController {
  #authService: AuthService;

  constructor(authService: AuthService) {
    this.#authService = authService;
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
