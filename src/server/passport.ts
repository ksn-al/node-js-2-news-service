import passport from 'passport';
import { RequestHandler } from 'express';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { UnauthorizedError } from './errors/UnauthorizedError';
import authService from './modules/auth/service';
import { logger } from './logger';

passport.use(
  new BearerStrategy((token, done) => {
    try {
      const user = authService.verifyToken(token);
      done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        logger.warn('Bearer auth failed', { message: error.message });
      }

      done(null, false);
    }
  })
);

export const requireAuth: RequestHandler = (req, res, next) => {
  passport.authenticate('bearer', { session: false }, (error: unknown, user: Express.User | false | null) => {
    if (error) {
      next(error);
      return;
    }

    if (!user) {
      next(new UnauthorizedError('Request is not authorized'));
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default passport;