import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  return Stack()
    .find()
    .filterByUser(user)
    .exec();
}

function getAllByProject(projectKey, user) {
  return Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUser(user)
    .exec();
}

function getAllByCategory(projectKey, user, category) {
  return Stack()
    .find({ category })
    .filterByProject(projectKey)
    .filterByUser(user)
    .exec();
}

function getAllByVolumeMount(projectKey, user, mount) {
  // Searches All Users
  return Stack()
    .find({ volumeMount: mount })
    .filterByProject(projectKey)
    .exec();
}

function getOneById(projectKey, user, id) {
  return Stack()
    .findOne({ _id: id })
    .filterByProject(projectKey)
    .filterOneByUser(user)
    .exec();
}

function getOneByName(projectKey, user, name) {
  // Searches All Users
  return Stack()
    .findOne({ name })
    .filterByProject(projectKey)
    .exec();
}

function createOrUpdate(projectKey, user, stack) {
  return Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUser(user)
    .findOneAndUpdate(
      { name: stack.name },
      { ...stack, users: [user.sub] },
      { upsert: true, setDefaultsOnInsert: true },
    )
    .exec();
}

function deleteStack(projectKey, user, stack) {
  return Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUser(user)
    .remove({ name: stack.name })
    .exec();
}

function updateStatus(stack) {
  const { projectKey, name, type, status } = stack;
  return Stack()
    .where({ projectKey, name, type })
    .updateOne({ status })
    .exec();
}

export default {
  getAll,
  getAllByProject,
  getAllByCategory,
  getOneById,
  getOneByName,
  getAllByVolumeMount,
  createOrUpdate,
  deleteStack,
  updateStatus,
};
