import express from 'express';
import bodyParser from 'body-parser';
import logger from 'winston';
import { service } from 'service-chassis';
import axios from 'axios';
import { merge } from 'lodash';
import configureCorsHeaders from './corsConfig';
import config from './config';
import graphql from './config/graphql';
import status from './status';
import { authorise, verifyToken } from './auth/authMiddleware';

const port = config.get('apiPort');

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

const app = express();
configureCorsHeaders(app);
app.use(service.middleware.metricsMiddleware);
app.use(bodyParser.json());

app.get('/status', status.get);

app.use('/api', authorise, verifyToken);
graphql.configureGraphQL(app);

configureAxiosForLocalDevelopment();
app.listen(port, () => logger.info(`App listening on port ${port}.`));

// When running locally (and therefore not within the cluster), requests to internal services
// don't have the required permissions. This function configures axios to add a cookie to
// each such request so that they can be properly authenticated. The testing cookie
// is the authorization cookie and can be obtained from a browser in which you are logged
// into DataLabs.
function configureAxiosForLocalDevelopment() {
  const testingCookie = config.get('testingCookie');

  if (!testingCookie) return;

  axios.interceptors.request.use((requestConfig) => {
    if (!requestConfig.url) {
      throw new Error('url not defined');
    }
    const url = new URL(requestConfig.url);

    if (url.host.includes('datalabs.internal')) {
      logger.info('Adding testing cookie to request to host datalabs.internal');
      return merge(
        requestConfig,
        { headers: { common: { cookie: `authorization=${testingCookie}` } } },
      );
    }

    return requestConfig;
  });
}
