import database from '../config/database';
import { DELETED } from '../models/dataStorage.model';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAllActive(user) {
  // Exclude records tagged as deleted
  const query = filterByUser(user, { status: { $ne: DELETED } });
  return DataStorage().find(query).exec();
}

function getAllByName(user, name) {
  // For all users
  return DataStorage().findOne({ name }).exec();
}

function getById(user, id) {
  const query = filterByUser(user, { _id: id });
  return DataStorage().findOne(query).exec();
}

function getByName(user, name) {
  const query = filterByUser(user, { name });
  return DataStorage().findOne(query).exec();
}

function createOrUpdate(user, requestedDataStore) {
  const query = filterByUser(user, { name: requestedDataStore.name });
  const dataStore = addOwner(user, requestedDataStore);
  return DataStorage().findOneAndUpdate(query, dataStore, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName(user, name) {
  const query = filterByUser(user, { name });
  return DataStorage().remove(query).exec();
}

function update(user, name, updatedValues) {
  const updateObj = setUsers(user, { $set: updatedValues });
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false });
}

const addOwner = ({ sub }, dataStore) => ({
  ...dataStore,
  users: [sub],
});

const filterByUser = ({ sub }, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: sub } },
});

const setUsers = ({ sub }, updateQuery) => ({
  ...updateQuery,
  $addToSet: { users: sub },
});

export default { getAllActive, getAllByName, getById, getByName, createOrUpdate, deleteByName, update };
