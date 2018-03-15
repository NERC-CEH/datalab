import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAllForUser(user) {
  return Stack()
    .find().filterByUser(user).exec();
}

function getAllByName(user, name) {
  return Stack()
    .findOne({ name }).exec();
}

export default { getAllForUser, getAllByName };
