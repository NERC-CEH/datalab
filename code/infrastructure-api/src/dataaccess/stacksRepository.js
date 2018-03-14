import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  return Stack()
    .find().filterByUser(user).exec();
}

export default { getAll };
