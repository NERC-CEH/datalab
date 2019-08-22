import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  return Stack()
    .find().filterByUser(user).exec();
}

function getAllByCategory(user, category) {
  return Stack()
    .find({ category }).filterByUser(user).exec();
}

function getAllByVolumeMount(user, mount) {
  // Searches All Users
  return Stack()
    .find({ volumeMount: mount }).exec();
}

function getOneById(user, id) {
  return Stack()
    .findOne({ _id: id }).filterOneByUser(user).exec();
}

function getOneByName(user, name) {
  // Searches All Users
  return Stack()
    .findOne({ name }).exec();
}

function createOrUpdate(user, stack) {
  return Stack()
    .find()
    .filterByUser(user)
    .findOneAndUpdate(
      { name: stack.name },
      { ...stack, users: [user.sub] },
      { upsert: true, setDefaultsOnInsert: true })
    .exec();
}

function deleteStack(user, stack) {
  return Stack()
    .find()
    .filterByUser(user)
    .remove({ name: stack.name })
    .exec();
}

function updateStatus(stack) {
  const { name, type, status } = stack;
  return Stack()
    .where({ name, type })
    .updateOne({ status })
    .exec();
}

export default {
  getAll,
  getAllByCategory,
  getOneById,
  getOneByName,
  getAllByVolumeMount,
  createOrUpdate,
  deleteStack,
  updateStatus,
};
