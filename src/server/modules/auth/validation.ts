import Ajv, { ErrorObject } from 'ajv';
import { ValidationError } from '../../errors/ValidationError';
import { LoginInput, RegisterInput } from './types';

const ajv = new Ajv({ allErrors: true, strict: false });

const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

const registerValidator = ajv.compile<RegisterInput>({
  type: 'object',
  properties: {
    email: { type: 'string', pattern: emailPattern },
    password: { type: 'string', minLength: 1 },
    confirmPassword: { type: 'string', minLength: 1 }
  },
  required: ['email', 'password', 'confirmPassword'],
  additionalProperties: false
});

const loginValidator = ajv.compile<LoginInput>({
  type: 'object',
  properties: {
    email: { type: 'string', pattern: emailPattern },
    password: { type: 'string', minLength: 1 }
  },
  required: ['email', 'password'],
  additionalProperties: false
});

function normalizePayload(input: unknown): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return input;
  }

  const source = input as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...source };

  if (typeof source.email === 'string') {
    normalized.email = source.email.trim().toLowerCase();
  }

  return normalized;
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) {
    return [];
  }

  return errors.map((error) => {
    const field = error.instancePath.replace(/^\//, '') || error.params.missingProperty || 'payload';
    return `${field} ${error.message || 'is invalid'}`;
  });
}

export function validateRegisterInput(input: unknown): RegisterInput {
  const payload = normalizePayload(input);

  if (!registerValidator(payload)) {
    throw new ValidationError('Invalid register payload', formatErrors(registerValidator.errors));
  }

  if (payload.password !== payload.confirmPassword) {
    throw new ValidationError('Passwords do not match');
  }

  return payload;
}

export function validateLoginInput(input: unknown): LoginInput {
  const payload = normalizePayload(input);

  if (!loginValidator(payload)) {
    throw new ValidationError('Invalid login payload', formatErrors(loginValidator.errors));
  }

  return payload;
}