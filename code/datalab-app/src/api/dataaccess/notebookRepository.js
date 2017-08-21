import database from '../config/database';

function Notebook() {
  return database.getModel('Notebook');
}

function getAll(user) {
  // return Notebook.find({ users: user.sub }).exec();
  return Notebook().find({}).exec();
}

function getById(user, id) {
  // return Notebook.findOne({ users: user.sub, _id: id });
  return Notebook().findOne({ _id: id }).exec();
}

export default { getAll, getById };
