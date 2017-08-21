import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DataStorageSchema = new Schema({
  name: String,
  storageType: Number,
  capacityTotal: String,
  capacityUsed: String,
  linkToStorage: String,
  internalEndpoint: String,
  users: [String],
});

mongoose.model('DataStorage', DataStorageSchema, 'dataStorage');
