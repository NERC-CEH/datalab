import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAllForUser(user) {
  return Stack()
    .find().filterByUser(user).exec();
}

function getAllForUserByCategory(user, category) {
  return Stack()
    .find({ category }).filterByUser(user).exec();
}

function getOneForUserById(user, id) {
  return Stack()
    .findOne({ _id: id }).filterOneByUser(user).exec();
}

function getOneByName(user, name) {
  return Stack()
    .findOne({ name }).exec();
}

export default { getAllForUser, getAllForUserByCategory, getOneForUserById, getOneByName };
