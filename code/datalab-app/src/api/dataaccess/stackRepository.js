import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  // return Stack.find({ users: user.sub }).exec();
  return Stack().find({}).exec();
}

function getByCategory(user, category) {
  return Stack().find({ category }).exec();
}

function getById(user, id) {
  // return Stack.findOne({ users: user.sub, _id: id });
  return Stack().findOne({ _id: id }).exec();
}

function getByName(user, name) {
  return Stack().findOne({ name }).exec();
}

function createOrUpdate(user, stack) {
  const query = { name: stack.name };
  return Stack().findOneAndUpdate(query, stack, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName(user, name) {
  return Stack().remove({ name }).exec();
}

export default { getAll, getByCategory, getById, getByName, createOrUpdate, deleteByName };
