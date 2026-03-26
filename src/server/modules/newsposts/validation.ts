import Ajv, { ErrorObject } from 'ajv';
import { ValidationError } from '../../errors/ValidationError';
import {
  CreateNewspostInput,
  NEWSPOST_GENRES,
  UpdateNewspostInput
} from './types';

const ajv = new Ajv({ allErrors: true, strict: false });

const newspostProperties = {
  title: { type: 'string', minLength: 1, maxLength: 50 },
  text: { type: 'string', minLength: 1, maxLength: 256 },
  genre: { type: 'string', enum: [...NEWSPOST_GENRES] },
  isPrivate: { type: 'boolean' }
} as const;

const createValidator = ajv.compile<CreateNewspostInput>({
  type: 'object',
  properties: newspostProperties,
  required: ['title', 'text', 'genre', 'isPrivate'],
  additionalProperties: false
});

const updateValidator = ajv.compile<UpdateNewspostInput>({
  type: 'object',
  properties: newspostProperties,
  minProperties: 1,
  additionalProperties: false
});

function normalizePayload(input: unknown): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return input;
  }

  const source = input as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...source };

  if (typeof source.title === 'string') {
    normalized.title = source.title.trim();
  }

  if (typeof source.text === 'string') {
    normalized.text = source.text.trim();
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

export function validateCreateNewspost(input: unknown): CreateNewspostInput {
  const payload = normalizePayload(input);

  if (!createValidator(payload)) {
    throw new ValidationError('Invalid newspost payload', formatErrors(createValidator.errors));
  }

  return payload;
}

export function validateUpdateNewspost(input: unknown): UpdateNewspostInput {
  const payload = normalizePayload(input);

  if (!updateValidator(payload)) {
    throw new ValidationError('Invalid newspost payload', formatErrors(updateValidator.errors));
  }

  return payload;
}