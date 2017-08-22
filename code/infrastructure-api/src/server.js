import express from 'express';
import chalk from 'chalk';
import logger from 'winston';
import config from './config/config';
import routes from './config/routes';

logger.level = config.get('logLevel');

const app = express();
routes.configureRoutes(app);

const port = config.get('apiPort');
app.listen(port, () => logger.info(chalk.green(`Management API listening on port ${port}`)));
