import { loggers, format, transports } from 'winston';

const { combine, timestamp, json } = format;

// Logger para acessos
loggers.add('access', {
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: './src/logger/output/access.log' }),
  ],
});

//cria o logger para erros
loggers.add('error', {
  level: 'error',
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: './src/logger/output/error.log' }),
  ],
});

// Uso
export const accessLogger = loggers.get('access');
export const errorLogger = loggers.get('error');
