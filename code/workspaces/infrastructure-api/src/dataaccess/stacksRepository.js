import { PROJECT_VIEWER_ROLE } from 'common/src/permissionTypes';
import database from '../config/database';

function Stack() {
  return database.getModel('Stack');
}

const filterViewableStacks = (stacks, user) => {
  const projectsWhereViewer = user.roles.instanceAdmin ? [] : user.roles.projectRoles.filter(r => r.role === PROJECT_VIEWER_ROLE).map(r => r.projectKey);
  return stacks.filter(s => s.category === 'PUBLISH' || !projectsWhereViewer.includes(s.projectKey));
};

async function getAllByUser(user) {
  const stacks = await Stack()
    .find()
    .filterByUserSharedVisible(user)
    .exec();

  const viewableStacks = filterViewableStacks(stacks, user);
  return viewableStacks;
}

function getAllStacks() {
  return Stack()
    .find()
    .exec();
}

async function getAllOwned(user) {
  const stacks = await Stack()
    .find()
    .filterByUser(user)
    .exec();

  const viewableStacks = filterViewableStacks(stacks, user);
  return viewableStacks;
}

async function getAllByProject(projectKey, user) {
  const stacks = await Stack()
    .find()
    .filterByProject(projectKey)
    .filterByUserSharedVisible(user)
    .exec();

  const viewableStacks = filterViewableStacks(stacks, user);
  return viewableStacks;
}

async function getAllByCategory(projectKey, user, category) {
  const stacks = await Stack()
    .find()
    .filterByCategory(category)
    .filterByProject(projectKey)
    .filterByUserSharedVisible(user)
    .exec();

  const viewableStacks = filterViewableStacks(stacks, user);
  return viewableStacks;
}

function getAllByVolumeMount(projectKey, user, mount, lean = false) {
  // Searches All Users
  return Stack()
    .find({ volumeMount: mount })
    .filterByProject(projectKey)
    .lean(lean)
    .exec();
}

const anonymiseStack = userId => (stack) => {
  if (stack.shared === 'private' || stack.visible === 'private') {
    // The "owner" of a private stack will be the first user in the array.
    const owner = stack.users[0];

    if (userId === owner) {
      return stack;
    }

    return {
      ...stack,
      name: 'private',
      displayName: 'Private',
      description: 'Private',
      url: null,
    };
  }

  return stack;
};

async function getAllByVolumeMountAnonymised(projectKey, user, mount) {
  // Gets all stacks used by a volume, but "anonymises" any stack names the caller shouldn't see.
  // Setting "lean" to true returns the values as JSON, making them more easily editable.
  const allByVolume = await getAllByVolumeMount(projectKey, user, mount, true);
  const callingUser = user.sub;

  const anonymised = allByVolume.map(anonymiseStack(callingUser));

  return anonymised;
}

function getAllByAsset(assetId) {
  return Stack()
    .find({ assetIds: { $elemMatch: { $eq: assetId } } })
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
  return (stack.users && stack.users.includes(user.sub)) || !!(user.roles && user.roles.instanceAdmin);
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

// Function is used by centralAssetRepoController
// when data manager removes permission to see asset
function updateAssets(_id, assetIds) {
  return Stack()
    .findOneAndUpdate({ _id }, { assetIds }, { new: true, omitUndefined: true })
    .exec();
}

function update(projectKey, user, name, updatedValues) {
  // Filter exclusively by owner (User)
  return Stack()
    .find()
    .filterByUser(user)
    .filterByProject(projectKey)
    .findOneAndUpdate({ name }, updatedValues, { new: true, omitUndefined: true })
    .exec();
}

export default {
  getAllByUser,
  getAllStacks,
  getAllOwned,
  getAllByProject,
  getAllByCategory,
  getAllByAsset,
  getOneById,
  getOneByName,
  getOneByNameUserAndCategory,
  getAllByVolumeMount,
  getAllByVolumeMountAnonymised,
  anonymiseStack,
  createOrUpdate,
  deleteStack,
  userCanDeleteStack,
  userCanRestartStack,
  updateStatus,
  updateAssets,
  update,
};
