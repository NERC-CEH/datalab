import database from '../config/database';
import clusterModel from '../models/cluster.model';

const ClusterModel = () => database.getModel(clusterModel.modelName);

async function createCluster(cluster) {
  const [document] = await ClusterModel().create([cluster], { setDefaultsOnInsert: true });
  return document;
}

async function deleteCluster({ projectKey, type, name }) {
  const result = await ClusterModel()
    .find({ projectKey })
    .find({ type })
    .remove({ name })
    .exec();
  return result;
}

async function clusterExists({ projectKey, name, displayName }) {
  if (projectKey && name && await ClusterModel().exists({ projectKey, name })) {
    return (`Cluster already exists with name of '${name}' in project with key '${projectKey}'.`);
  }
  if (projectKey && displayName && await ClusterModel().exists({ projectKey, displayName })) {
    return (`Cluster already exists with display name of '${displayName}' in project with key '${projectKey}'.`);
  }
  return null;
}

async function listByProject(projectKey) {
  const documents = await ClusterModel().find({ projectKey }).exec();
  return documents;
}

async function getAll() {
  return ClusterModel().find().exec();
}

function getByVolumeMount(projectKey, mount) {
  return ClusterModel()
    .find({ projectKey, volumeMount: mount })
    .exec();
}

// Function is used by kube-watcher to update stacks status. This will require an
// update when kube-watcher updated to handle projectKey.
function updateStatus(stack) {
  const { name, namespace, type, status } = stack;
  return ClusterModel()
    .where({ name, type, projectKey: namespace })
    .updateOne({ status })
    .exec();
}

export default {
  createCluster,
  deleteCluster,
  clusterExists,
  listByProject,
  getByVolumeMount,
  getAll,
  updateStatus,
};
