import { Router } from 'express';

import { LoggerService } from '../Logger/Logger.service';

import { RouteInterface } from './route.interface';

export class RouteController {
  #router: Router;

  #logger: LoggerService;

  constructor(logger: LoggerService) {
    this.#router = Router();
    this.#logger = logger;
  }

  bindRouter = (routes: RouteInterface[]): void => {
    routes.forEach((route) => {
      this.#logger.log(`Initialized route ${route.path}`);
      this.#router[route.method](route.path, route.func);
    });
  };

  get router(): Router {
    return this.#router;
  }
}
