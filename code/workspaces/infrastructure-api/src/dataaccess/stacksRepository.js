import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAll(user) {
  return Stack()
    .find()
    .filterByUserSharedVisible(user)
    .exec();
}

function getAllByProject(projectKey, user) {
  return Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUserSharedVisible(user)
    .exec();
}

function getAllByCategory(projectKey, user, category) {
  return Stack()
    .find({ category })
    .filterByProject(projectKey)
    .filterByUserSharedVisible(user)
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
    .filterOneByProject(projectKey)
    .filterOneByUserSharedVisible(user)
    .exec();
}

function getOneByName(projectKey, user, name) {
  // Searches All Users
  return Stack()
    .findOne({ name })
    .filterOneByProject(projectKey)
    .exec();
}

function getOneByNameUserAndCategory(projectKey, user, name, category) {
  return Stack()
    .find({ category })
    .findOne({ name })
    .filterOneByProject(projectKey)
    .filterByUser(user)
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

async function userCanDeleteStack(projectKey, user, name) {
  const stack = await getOneByName(projectKey, user, name);
  return stack.users.includes(user.sub);
}

// Function is used by kube-watcher to update stacks status. This will require an
// update when kube-watcher updated to handle projectKey.
function updateStatus(stack) {
  const { name, namespace, type, status } = stack;
  return Stack()
    .where({ name, type, projectKey: namespace })
    .updateOne({ status })
    .exec();
}

export default {
  getAll,
  getAllByProject,
  getAllByCategory,
  getOneById,
  getOneByName,
  getOneByNameUserAndCategory,
  getAllByVolumeMount,
  createOrUpdate,
  deleteStack,
  userCanDeleteStack,
  updateStatus,
};
