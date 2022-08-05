import { Request, Response, NextFunction } from 'express';

import { HttpError } from './HttpError.class';

export interface ErrorInterface {
  catch: (err: Error | HttpError, req: Request, res: Response, _next: NextFunction) => void;
}
