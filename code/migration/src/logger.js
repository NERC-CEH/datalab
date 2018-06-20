import winston from 'winston';
import config from './config/config';

const logger = winston.createLogger({
  level: config.get('logLevel'),
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
