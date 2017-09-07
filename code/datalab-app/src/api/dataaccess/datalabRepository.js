import database from '../config/database';

function Datalab() {
  return database.getModel('Datalab');
}

function getAll(user) {
  // return DataStorage.find({ users: user.sub }).exec();
  return Datalab().find({}).exec();
}

function getByName(user, name) {
  // return DataStorage.findOne({ users: user.sub, _id: id });
  return Datalab().findOne({ name }).exec();
}

export default { getAll, getByName };
