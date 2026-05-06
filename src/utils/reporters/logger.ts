import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

const { combine, timestamp, colorize, simple, metadata } = format;

export const lokiTransport = new LokiTransport({
  host: process.env.LOKI_URL || 'http://localhost:3100',
  labels: { job: 'playwright-tests' },
  json: true,
  batching: false,
  replaceTimestamp: false,
  onConnectionError: (err) => console.error('Loki Connection Error:', err),
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), metadata({ fillExcept: ['message', 'level', 'timestamp', 'labels'] })),
  transports: [
    new transports.Console({
      format: combine(colorize(), simple()),
    }),
    lokiTransport,
  ],
});

export async function flushLoki(timeoutMs = 3000): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      lokiTransport.end();
      resolve();
    }, timeoutMs);
  });
}
