import passport from 'passport';
import { RequestHandler } from 'express';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { AuthTokenPayload } from './modules/auth/types';
import { JWT_SECRET } from './modules/auth/constants';
import authService from './modules/auth/service';
import { logger } from './logger';

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use(
  new JwtStrategy(strategyOptions, async (payload: AuthTokenPayload, done) => {
    try {
      const user = await authService.getAuthenticatedUserFromTokenPayload(payload);
      done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        logger.warn('JWT auth failed', { message: error.message });
      }

      done(null, false);
    }
  })
);

export const requireAuth: RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error: unknown, user: Express.User | false | null) => {
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