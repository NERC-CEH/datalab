import mongoose from 'mongoose';
import bluebird from 'bluebird';
import logger from 'winston';
import { readdirSync } from 'fs';
import { join } from 'path';
import config from './config';

const models = join(__dirname, '../models');

/* This call registers the models the first time the database module is imported.
 * The reason for this is to allow the repository modules to import the models when
 * they are initialised as this keeps that code cleaner.
 */
registerModels();

function registerModels() {
  readdirSync(models)
    .filter(file => file.includes('.model.js'))
    .forEach(file => registerModel(file));
}

function getModel(modelName) {
  return mongoose.model(modelName);
}

function createConnection() {
  mongoose.Promise = bluebird;
  const options = {
    promiseLibrary: bluebird,
    keepAlive: true,
    useNewUrlParser: true,
    user: config.get('databaseUser'),
    pass: config.get('databasePassword'),
    auth: { authSource: 'admin' },
  };
  mongoose.connect(`mongodb://${config.get('databaseHost')}/users`, options);
  return mongoose.connection;
}

function registerModel(modelName) {
  logger.info(`Register model: ${modelName}`);
  require(join(models, modelName)); // eslint-disable-line
}

export default { createConnection, getModel };
