import logger from 'winston';
import { find } from 'lodash';
import kubeWatcher from './kubeWatcher/kubeWatcher';
import config from './config/config';

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

kubeWatcher()
  .on('added', () => {
    logger.debug('Pod added');
  })
  .on('modified', (event) => {
    if (event.status.phase === 'Running' && event.metadata.deletionTimestamp === undefined) {
      if (find(event.status.conditions, { type: 'Ready', status: 'True' })) {
        logger.debug('Pod ready');
      }
    }
  })
  .on('deleted', () => {
    logger.debug('Pod deleted');
  })
  .on('error', (err) => {
    logger.info(`Error ${err.code}: ${err.message}`);
  });
