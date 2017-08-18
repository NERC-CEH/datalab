import database from '../config/database';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAll(user) {
  // return Notebook.find({ users: user.sub }).exec();
  return DataStorage().find({}).exec();
}

function getById(user, id) {
  // return Notebook.findOne({ users: user.sub, _id: id });
  return DataStorage().findOne({ _id: id }).exec();
}

export default { getAll, getById };
