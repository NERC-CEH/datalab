import database from '../config/database';
import { DELETED } from '../models/dataStorage.model';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAll(user) {
  // return DataStorage.find({ users: user.sub }).exec();
  // Exclude records tagged as deleted
  return DataStorage().find({ status: { $ne: DELETED } }).exec();
}

function getById(user, id) {
  // return DataStorage.findOne({ users: user.sub, _id: id });
  return DataStorage().findOne({ _id: id }).exec();
}

function getByName(user, name) {
  return DataStorage().findOne({ name }).exec();
}

function createOrUpdate(user, dataStore) {
  const query = { name: dataStore.name };
  return DataStorage().findOneAndUpdate(query, dataStore, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName(user, name) {
  return DataStorage().remove({ name }).exec();
}

function update(user, name, updateValues) {
  const updateWithOperators = { $set: updateValues };
  return DataStorage().findOneAndUpdate({ name }, updateWithOperators, { upsert: false });
}

export default { getAll, getById, getByName, createOrUpdate, deleteByName, update };
