export class ValidationError extends Error {
  readonly details: string[];

  constructor(message: string, details: string[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}