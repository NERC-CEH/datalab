import express from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'winston';
import { service } from 'service-chassis';
import config from './config/config';
import routes from './config/routes';
import database from './config/database';

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(service.middleware.metricsMiddleware);
routes.configureRoutes(app);

app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
  if (error.name === 'UnauthorizedError') {
    logger.warn(`Unsuccessful authentication request from ${request.hostname}`);
    response.status(401);
    return response.send({ message: 'Unable to authenticate user' });
  }

  logger.error(error);
  response.status(500);
  return response.send({ message: error.message });
});

const connection = database.createConnection();

connection.on('error', error => logger.error(chalk.red(`Error connecting to the database ${error}`)))
  .on('disconnected', error => logger.info(`Disconnected: ${error}`))
  .once('open', listen);

const port = config.get('port');
function listen() {
  app.listen(port, () => logger.info(chalk.green(`Authorisation Service listening on port ${port}`)));
}

