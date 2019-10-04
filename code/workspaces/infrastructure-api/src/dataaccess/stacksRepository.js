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
    .filterOneByProject(projectKey)
    .filterOneByUser(user)
    .exec();
}

function getOneByName(projectKey, user, name) {
  // Searches All Users
  return Stack()
    .findOne({ name })
    .filterOneByProject(projectKey)
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

// Function is used by kube-water to update stacks status. This will require an
// update when kube-water updated to handle projectKey.
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
  getAllByVolumeMount,
  createOrUpdate,
  deleteStack,
  updateStatus,
};
