export class AuthServiceError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthServiceError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}