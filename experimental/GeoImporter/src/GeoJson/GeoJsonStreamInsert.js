import fs from 'fs';
import readline from 'readline';
import mongoose, { Schema } from 'mongoose';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'GeoJSON Mongo Importer' });

class GeoJsonStreamInsert {
  constructor(dbUri, collectionName, geoJsonFileName, transactionSize = 20000) {
    this.dbContext = generateMongoConnection(dbUri, collectionName);
    this.fileName = geoJsonFileName;
    this.transactionSize = transactionSize;
    this.lineCount = 0;
    this.dropCount = 0;
    this.transactionCount = 0;
    this.transaction = [];
    this.lineEvent = this.lineEvent.bind(this);
    this.closeEvent = this.closeEvent.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.flushTransaction = this.flushTransaction.bind(this);
    this.process = this.process.bind(this);
  }

  lineEvent(line) {
    this.lineCount += 1;
    if (line.length > 2 && line.endsWith('},')) {
      this.updateTransaction(line.slice(0, -1));
    } else {
      this.dropCount += 1;
    }
  }

  closeEvent() {
    this.flushTransaction();
    mongoose.disconnect();
    logger.info('Finished processing file.');
    logger.info(`Processed ${this.lineCount} lines.`);
    logger.info(`Dropped ${this.dropCount} lines.`);
    logger.info(`Pushed ${this.transactionCount} transactions.`);
    logger.info(`Saved ${this.lineCount - this.dropCount} entries.`);
  }

  updateTransaction(line) {
    this.transaction.push(line);
    if (this.transaction.length >= this.transactionSize) {
      this.flushTransaction();
    }
  }

  flushTransaction() {
    if (this.transaction.length > 0) {
      bulkInsert(this.transaction.map(JSON.parse), this.dbContext);
      logger.info('Insert transaction.');
      this.transactionCount += 1;
      this.transaction = [];
    }
  }

  process() {
    generateReadLineStream(this.fileName, this.lineEvent, this.closeEvent);
  }
}

function generateReadLineStream(fileName, lineEvent, closeEvent) {
  logger.info(`Establishing "${fileName}" as a file stream.`);
  const fileStream = fs.createReadStream(fileName);
  const readFileStream = readline.createInterface({ input: fileStream });
  readFileStream.on('line', lineEvent);
  readFileStream.on('close', closeEvent);
  return readFileStream;
}

function generateMongoConnection(dbUri, collectionName) {
  mongoose.connect(dbUri);
  const dbConnection = mongoose.connection;
  dbConnection.on('error', msg => logger.warn('MongoDB connection failed.', msg));
  const featureSchema = Schema({ type: String, properties: Object, geometry: Object });
  return mongoose.model(collectionName, featureSchema);
}

function bulkInsert(dataBlock, context) {
  // Add promise to throw if not inserted
  context.collection.insert(dataBlock);
}

export default GeoJsonStreamInsert;
