import { ErrorRequestHandler } from 'express';
import { ValidationError } from '../errors/ValidationError';
import { NewspostsServiceError } from '../errors/NewspostsServiceError';
import { logger } from '../logger';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ValidationError) {
    logger.warn(error.message, {
      method: req.method,
      url: req.originalUrl,
      details: error.details
    });
    res.status(400).json({ message: error.message });
    return;
  }

  const normalizedError = error instanceof Error
    ? error
    : new Error('Internal server error');

  logger.error(normalizedError.message, {
    method: req.method,
    url: req.originalUrl,
    stack: normalizedError.stack
  });

  if (error instanceof NewspostsServiceError) {
    res.status(500).json({ message: normalizedError.message });
    return;
  }

  res.status(500).json({ message: normalizedError.message });
};