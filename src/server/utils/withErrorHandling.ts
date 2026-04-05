import { NextFunction, Request, RequestHandler, Response } from 'express';

type ControllerHandler = (req: Request, res: Response) => void | Promise<void>;

export function withErrorHandling(handler: ControllerHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
}
