import logger from 'winston';
import kubeWatcher, { podAddedWatcher, podReadyWatcher, podDeletedWatcher } from './kubeWatcher/kubeWatcher';
import config from './config/config';

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

kubeWatcher()
  .on('added', podAddedWatcher)
  .on('modified', podReadyWatcher)
  .on('deleted', podDeletedWatcher)
  .on('error', (err) => {
    logger.info(`Error ${err.code}: ${err.message}`);
  });
