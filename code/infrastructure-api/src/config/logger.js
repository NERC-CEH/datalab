import { createLogger, transports, format } from 'winston';
import config from './config';

function initialiseLogger() {
  const logger = createLogger({
    level: config.get('logLevel'),
    defaultMeta: { service: 'infrastructure-service' },
    transports: [
      new transports.Console({
        format: format.combine(
          format.json(),
          format.timestamp(),
        ),
      }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.clear();
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple(),
      ),
    }));
  }
  return logger;
}

const logger = initialiseLogger();
export default logger;
