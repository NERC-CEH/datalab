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

export default { getAll, getAllByCategory, getOneById, getOneByName, getAllByVolumeMount };
