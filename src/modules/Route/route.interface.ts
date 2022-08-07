import { NextFunction, Request, Response, Router } from 'express';

export interface RouteInterface {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
}
