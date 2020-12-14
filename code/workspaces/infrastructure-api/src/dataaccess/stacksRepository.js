import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

function getAllByUser(user) {
  return Stack()
    .find()
    .filterByUserSharedVisible(user)
    .exec();
}

function getAllStacks() {
  return Stack()
    .find()
    .exec();
}

function getAllOwned(user) {
  return Stack()
    .find()
    .filterByUser(user)
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
    .find()
    .filterByCategory(category)
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
    .find()
    .filterByCategory(category)
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
  // Filter exclusively by owner (User)
  return Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUser(user)
    .remove({ name: stack.name })
    .exec();
}

async function userCanDeleteStack(projectKey, user, name) {
  const stack = await getOneByName(projectKey, user, name);
  return stack.users && stack.users.includes(user.sub);
}

async function userCanRestartStack(projectKey, user, name) {
  // same as delete - only users in list can restart stack
  return userCanDeleteStack(projectKey, user, name);
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

function update(projectKey, user, name, updatedValues) {
  // Filter exclusively by owner (User)
  return Stack()
    .find({ name })
    .filterByUser(user)
    .filterByProject(projectKey)
    .updateOne(updatedValues)
    .exec();
}

export default {
  getAllByUser,
  getAllStacks,
  getAllOwned,
  getAllByProject,
  getAllByCategory,
  getOneById,
  getOneByName,
  getOneByNameUserAndCategory,
  getAllByVolumeMount,
  createOrUpdate,
  deleteStack,
  userCanDeleteStack,
  userCanRestartStack,
  updateStatus,
  update,
};
