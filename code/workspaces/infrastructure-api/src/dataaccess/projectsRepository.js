import database from '../config/database';

const Project = () => database.getModel('Project');

async function getAll() {
  return Project().find().exec();
}

async function getByKey(projectKey) {
  return Project().findOne({ key: projectKey }).exec();
}

async function exists(projectKey) {
  return Project().exists({ key: projectKey });
}

async function create(project) {
  // needs to be in array else thinks is spread of projects and not project then options
  // as passing projects as array, create returns an array
  return Project().create([project], { setDefaultsOnInsert: true });
}

async function createOrUpdate(project) {
  return Project().findOneAndUpdate(
    { key: project.key },
    project,
    { upsert: true, setDefaultsOnInsert: true, new: true },
  );
}

async function deleteByKey(projectKey) {
  return Project().remove({ key: projectKey }).exec();
}

export default {
  getAll,
  getByKey,
  exists,
  create,
  createOrUpdate,
  deleteByKey,
};
