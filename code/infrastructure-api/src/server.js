import express from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import logger from 'winston';
import config from './config/config';
import routes from './config/routes';
import verifyToken from './auth/authMiddleware';

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

const app = express();
app.use(bodyParser.json());
app.all('*', verifyToken);
routes.configureRoutes(app);

const port = config.get('apiPort');
app.listen(port, () => logger.info(chalk.green(`Management API listening on port ${port}`)));
