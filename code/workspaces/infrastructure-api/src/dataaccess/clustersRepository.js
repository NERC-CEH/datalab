import database from '../config/database';
import clusterModel from '../models/cluster.model';

const ClusterModel = () => database.getModel(clusterModel.modelName);

async function createCluster(cluster) {
  const [document] = await ClusterModel().create([cluster], { setDefaultsOnInsert: true });
  return document;
}

async function clusterExists({ projectKey, name }) {
  if (projectKey && name && await ClusterModel().exists({ projectKey, name })) {
    return ([`Cluster already exists with name of '${name}' in project with key '${projectKey}'.`]);
  }
  return [];
}

export default {
  createCluster,
  clusterExists,
};
