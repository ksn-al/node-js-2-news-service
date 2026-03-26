export class NewspostsServiceError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'NewspostsServiceError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}