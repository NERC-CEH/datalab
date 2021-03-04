import database from '../config/database';
import clusterModel from '../models/cluster.model';

const ClusterModel = () => database.getModel(clusterModel.modelName);

async function createCluster(cluster) {
  const [document] = await ClusterModel().create([cluster], { setDefaultsOnInsert: true });
  return document;
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

export default {
  createCluster,
  clusterExists,
  listByProject,
};
