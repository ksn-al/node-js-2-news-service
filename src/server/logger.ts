import * as fs from 'fs';
import * as path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logsDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const metadata = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  const stackTrace = typeof stack === 'string' ? `\n${stack}` : '';
  return `${timestamp} [${level.toUpperCase()}] ${message}${metadata}${stackTrace}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 1024 * 1024,
      maxFiles: 10
    })
  ]
});