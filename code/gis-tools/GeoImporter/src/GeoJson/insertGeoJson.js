import fs from 'fs';
import readline from 'readline';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'GeoJSON Processor' });

function streamFeaturesToMongo(dbConnection, fileName, transactionSize) {
  let lineCount = 0;
  let droppedCount = 0;
  let transactionCount = 0;
  let transaction = [];
  const fileStream = fs.createReadStream(fileName);
  const readFileStream = readline.createInterface({ input: fileStream });
  logger.info(`Starting to process "${fileName}"`);

  readFileStream.on('line', (line) => {
    lineCount += 1;
    if (line.length > 2 && line.endsWith('},')) {
      transaction.push(line.slice(0, -1));
    } else {
      droppedCount += 1;
    }

    if (transaction.length >= transactionSize) {
      dbConnection.collection.insert(transaction.map(JSON.parse))
        .then(() => logger.info('Insert transaction.'))
        .catch(() => logger.warn('MongoDB insert failed.'));
      transactionCount += 1;
      transaction = [];
    }

    // if (lineCount > 20) {
    //   // Kill stream for dev only
    //   fileStream.destroy();
    //   readFileStream.close();
    // }
  });

  readFileStream.on('close', () => {
    mongoose.disconnect();
    logger.info(`Processed ${lineCount} lines.`);
    logger.info(`Dropped ${droppedCount} lines.`);
    logger.info(`Pushed ${transactionCount} transactions.`);
  });
}

function connectToMongo(dbUri, collectionName) {
  // Replace mongoose promise library with bluebird
  mongoose.Promise = Promise;
  return mongoose.connect(dbUri)
    .then(() => {
      logger.info(`Connection established to MongoDB on "${dbUri}".`);
      const featureSchema = new mongoose.Schema({ type: String, properties: Object, geometry: Object });
      return mongoose.model(collectionName, featureSchema);
    })
    .catch(msg => logger.warn('DB connection failed.', msg));
}

function insertFeatures(dbUri, fileName, collectionName, transactionSize = 10000) {
  // Additional args collectionName
  connectToMongo(dbUri, collectionName).then((dbConnection) => {
    streamFeaturesToMongo(dbConnection, fileName, transactionSize);
  });
}

export default insertFeatures;
