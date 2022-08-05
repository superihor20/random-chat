import { NextFunction, Request, Response } from 'express';

import { AuthService } from './Auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.signUp(req.body);

      res.status(201).end('opa nihyya');
    } catch (e) {
      next(e);
    }
  };
}
