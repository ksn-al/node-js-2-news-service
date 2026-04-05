import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthServiceError } from '../../errors/AuthServiceError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ValidationError } from '../../errors/ValidationError';
import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from './constants';
import authRepository from './repository';
import {
  AuthenticatedUser,
  AuthTokenPayload,
  AuthResponse,
  LoginInput,
  PublicUser,
  RegisterInput
} from './types';

class AuthService {
  async register(payload: RegisterInput): Promise<AuthResponse> {
    try {
      const existingUser = await authRepository.findByEmail(payload.email);

      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      const passwordHash = await this.hashPassword(payload.password);
      const createdUser = await authRepository.createUser(payload.email, passwordHash);
      return this.buildAuthResponse(createdUser.id, createdUser.email);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      throw this.wrapError('Failed to register user', error);
    }
  }

  async login(payload: LoginInput): Promise<AuthResponse> {
    try {
      const user = await authRepository.findByEmail(payload.email);

      if (!user || !(await this.comparePassword(payload.password, user.password))) {
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

  async getAuthorizedUser(userId: number): Promise<PublicUser> {
    try {
      const user = await authRepository.getById(userId);

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

  async getAuthenticatedUserFromTokenPayload(payload: AuthTokenPayload): Promise<AuthenticatedUser> {
    try {
      if (typeof payload.uid !== 'number' || typeof payload.sub !== 'string') {
        throw new UnauthorizedError('Token payload is invalid');
      }

      const user = await authRepository.getById(payload.uid);

      if (!user || user.email !== payload.sub) {
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

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  private async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private wrapError(message: string, error: unknown): AuthServiceError {
    if (error instanceof AuthServiceError) {
      return error;
    }

    return new AuthServiceError(message, error);
  }
}

export default new AuthService();