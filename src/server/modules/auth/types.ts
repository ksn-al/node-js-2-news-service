export interface UserRecord {
  id: number;
  email: string;
  password: string;
}

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

export interface PublicUser {
  id: number;
  email: string;
}