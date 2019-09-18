import database from '../config/database';

const Project = () => database.getModel('Project');

async function getAll() {
  return Project().find().exec();
}

async function getByKey(key) {
  return Project().findOne({ projectKey: key }).exec();
}

async function exists(document) {
  return Project().exists({ projectKey: document.projectKey });
}

async function create(document) {
  return Project().create(document);
}

async function createOrUpdate(document) {
  return Project().findOneAndUpdate(
    { projectKey: document.projectKey },
    document,
    { upsert: true, setDefaultsOnInsert: true },
  );
}

async function deleteByKey(key) {
  return Project().remove({ projectKey: key }).exec();
}

export default {
  getAll,
  getByKey,
  exists,
  create,
  createOrUpdate,
  deleteByKey,
};
