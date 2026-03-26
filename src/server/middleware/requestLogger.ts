import { RequestHandler } from 'express';
import { logger } from '../logger';

export const requestLogger: RequestHandler = (req, _res, next) => {
  const body = req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0
    ? req.body
    : undefined;

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body
  });

  next();
};