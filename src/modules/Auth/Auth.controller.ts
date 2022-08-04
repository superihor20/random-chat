import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../Error/HttpError.class';

import { AuthService } from './Auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = (req: Request, res: Response, next: NextFunction): void => {
    const result = this.authService.validateSignUp(req.body);

    if (!result.success) {
      next(
        new HttpError(403, result.error.issues.map((issue) => issue.message).join(', '), 'Sign Up')
      );
    }

    res.end();
  };
}
