import { User } from '../../../fileDB/types';

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface AuthTokenPayload {
  sub: string;
  uid: number;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
}

export type PublicUser = Omit<User, 'password'>;