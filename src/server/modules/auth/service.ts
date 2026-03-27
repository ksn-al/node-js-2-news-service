import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AuthServiceError } from '../../errors/AuthServiceError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ValidationError } from '../../errors/ValidationError';
import authRepository from './repository';
import {
  AuthenticatedUser,
  AuthResponse,
  LoginInput,
  PublicUser,
  RegisterInput
} from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

interface AuthTokenPayload {
  sub: string;
  uid: number;
}

class AuthService {
  register(payload: RegisterInput): AuthResponse {
    try {
      const existingUser = authRepository.findByEmail(payload.email);

      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      const passwordHash = this.hashPassword(payload.password);
      const createdUser = authRepository.createUser(payload.email, passwordHash);
      return this.buildAuthResponse(createdUser.id, createdUser.email);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      throw this.wrapError('Failed to register user', error);
    }
  }

  login(payload: LoginInput): AuthResponse {
    try {
      const user = authRepository.findByEmail(payload.email);
      const passwordHash = this.hashPassword(payload.password);

      if (!user || user.password !== passwordHash) {
        throw new UnauthorizedError('Invalid email or password');
      }

      return this.buildAuthResponse(user.id, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw this.wrapError('Failed to login user', error);
    }
  }

  getAuthorizedUser(userId: number): PublicUser {
    try {
      const user = authRepository.getById(userId);

      if (!user) {
        throw new UnauthorizedError('User is not authorized');
      }

      return {
        id: user.id,
        email: user.email
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw this.wrapError('Failed to fetch authorized user', error);
    }
  }

  verifyToken(token: string): AuthenticatedUser {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;

      if (typeof decoded.uid !== 'number' || typeof decoded.sub !== 'string') {
        throw new UnauthorizedError('Token payload is invalid');
      }

      const user = authRepository.getById(decoded.uid);

      if (!user || user.email !== decoded.sub) {
        throw new UnauthorizedError('Token is invalid');
      }

      return {
        id: user.id,
        email: user.email
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new UnauthorizedError('Unauthorized request');
    }
  }

  private buildAuthResponse(userId: number, email: string): AuthResponse {
    const token = jwt.sign(
      {
        uid: userId,
        sub: email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token: `Bearer ${token}`
    };
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private wrapError(message: string, error: unknown): AuthServiceError {
    if (error instanceof AuthServiceError) {
      return error;
    }

    return new AuthServiceError(message, error);
  }
}

export default new AuthService();