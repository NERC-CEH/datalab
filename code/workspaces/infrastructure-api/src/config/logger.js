import { createLogger, transports, format } from 'winston';
import config from './config';

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    return {
      ...info.message,
      message: info.message.message,
      stack: info.message.stack,
    };
  }

  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }

  return info;
});

function initialiseLogger() {
  const logger = createLogger({
    level: config.get('logLevel'),
    defaultMeta: { service: 'infrastructure-service' },
    format: format.combine(
      format.timestamp(),
      enumerateErrorFormat(),
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          enumerateErrorFormat(),
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
        enumerateErrorFormat(),
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
