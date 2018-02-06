import NodeCache from 'node-cache';
import Promise from 'bluebird';
import logger from 'winston/lib/winston';

const cache = new NodeCache({
  stdTTL: 120, // Standard time to live, 2 minutes
  errorOnMissing: true,
});

Promise.promisifyAll(cache);
cache.on('set', createLogger('set'));
cache.on('expired', createLogger('expire'));

export const getOrSetCacheAsyncWrapper = (keyName, asyncFunc) => (...args) =>
  cache.getAsync(keyName)
    .then((value) => {
      createLogger('get')(keyName, value);
      return value;
    })
    .catch(() =>
      asyncFunc(args)
        .then(setCache(keyName)));

export const setCache = keyName => value =>
  cache.setAsync(keyName, value)
    .then(() => value);

function createLogger(action) {
  return (key, value) => {
    logger.debug(`Cache: ${action} key: ${key}`);
    logger.debug(`Cache: ${action} value: ${JSON.stringify(value)}`);
  };
}

export default cache;
