import logger from 'winston';
import chalk from 'chalk';
import kubeWatcher, { podAddedWatcher, podReadyWatcher, podDeletedWatcher } from './kubeWatcher/kubeWatcher';
import stackStatusChecker from './kubeWatcher/stackStatusChecker';
import config from './config/config';
import database from './config/database';

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

function watcher() {
  return kubeWatcher()
    .on('added', podAddedWatcher)
    .on('modified', podReadyWatcher)
    .on('deleted', podDeletedWatcher)
    .on('error', (err) => {
      logger.info(chalk.red(`Error ${err.code}: ${err.message}`));
    });
}

setInterval(stackStatusChecker, config.get('statusCheckInterval'));

database.createConnection()
  .then(watcher)
  .catch(error => logger.error(chalk.red(`Error connecting to the database ${error}`)));
