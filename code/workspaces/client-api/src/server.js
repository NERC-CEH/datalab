import express from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import logger from 'winston';
import { service } from 'service-chassis';
import configureCorsHeaders from './corsConfig';
import config from './config';
import database from './config/database';
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

const connection = database.createConnection();

connection.on('error', error => logger.error(chalk.red(`Error connecting to the database ${error}`)))
  .on('disconnected', error => logger.info(`Disconnected: ${error}`))
  .once('open', listen);

function listen() {
  app.listen(port, () => logger.info(`App listening on port ${port}.`));
}
