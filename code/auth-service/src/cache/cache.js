import NodeCache from 'node-cache';
import Promise from 'bluebird';
import logger from 'winston/lib/winston';

const cache = new NodeCache({
  stdTTL: 120, // Standard time to live, 2 minutes
  errorOnMissing: true,
});

Promise.promisifyAll(cache);

export const getOrSetCacheAsyncWrapper = (keyName, asyncFunc) => (...args) =>
  cache.getAsync(keyName)
    .then((value) => {
      createLoggingMesage('Get', keyName);
      return value;
    })
    .catch(() =>
      asyncFunc(args)
        .then(setCache(keyName)));

export const setCache = keyName => value =>
  cache.setAsync(keyName, value)
    .then(() => {
      createLoggingMesage('Set', keyName);
      return value;
    });

const createLoggingMesage = (action, keyName) =>
  logger.debug(`Cache: ${action} value for key: ${keyName}`);

export default cache;
