import database from '../config/database';

function Datalab() {
  return database.getModel('Datalab');
}

function getAll(user) {
  return Datalab().find({}).exec();
}

function getByName(user, name) {
  return Datalab().findOne({ name }).exec();
}

export default { getAll, getByName };
