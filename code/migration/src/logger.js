import winston from 'winston';
import config from './config/config';

const logger = winston.createLogger({
  level: config.get('logLevel'),
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
