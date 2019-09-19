import database from '../config/database';

const Project = () => database.getModel('Project');

async function getAll() {
  return Project().find().exec();
}

async function getByKey(projectKey) {
  return Project().findOne({ projectKey }).exec();
}

async function exists(projectKey) {
  return Project().exists({ projectKey });
}

async function create(project) {
  return Project().create(project);
}

async function createOrUpdate(project) {
  return Project().findOneAndUpdate(
    { projectKey: project.projectKey },
    project,
    { upsert: true, setDefaultsOnInsert: true, new: true },
  );
}

async function deleteByKey(projectKey) {
  return Project().remove({ projectKey }).exec();
}

export default {
  getAll,
  getByKey,
  exists,
  create,
  createOrUpdate,
  deleteByKey,
};
