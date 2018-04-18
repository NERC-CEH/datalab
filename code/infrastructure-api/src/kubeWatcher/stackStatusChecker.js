import logger from 'winston';
import podsApi from '../kubernetes/podsApi';

function statusChecker() {
  logger.info('Starting status checker.');

  podsApi.getStacks()
    .then(res => logger.info(res));
}

export default statusChecker;
