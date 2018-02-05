import database from '../config/database';
import { getCategoryForType } from '../../shared/stackTypes';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  const query = filterByUser(user, {});
  return Stack().find(query).exec();
}

function getByCategory(user, category) {
  const query = filterByUser(user, { category });
  return Stack().find(query).exec();
}

function getById(user, id) {
  const query = filterByUser(user, { _id: id });
  return Stack().findOne(query).exec();
}

function getByName(user, name) {
  const query = filterByUser(user, { name });
  return Stack().findOne(query).exec();
}

function getByVolumeMount(user, volumeMount) {
  return Stack().find({ volumeMount }).exec();
}

function createOrUpdate(user, requestStack) {
  const query = filterByUser(user, { name: requestStack.name });
  const stack = addOwner(user, { ...requestStack, category: getCategoryForType(requestStack.type) });
  return Stack().findOneAndUpdate(query, stack, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName(user, name) {
  const query = filterByUser(user, { name });
  return Stack().remove(query).exec();
}

const addOwner = ({ sub }, stack) => ({
  ...stack,
  users: [sub],
});

const filterByUser = ({ sub }, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: sub } },
});

export default { getAll, getByCategory, getById, getByName, getByVolumeMount, createOrUpdate, deleteByName };
