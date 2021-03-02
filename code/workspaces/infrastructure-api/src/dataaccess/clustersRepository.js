import database from '../config/database';
import clusterModel from '../models/cluster.model';

const ClusterModel = () => database.getModel(clusterModel.modelName);

async function createCluster(cluster) {
  const [document] = await ClusterModel().create([cluster], { setDefaultsOnInsert: true });
  return document;
}

async function clusterExists({ name }) {
  if (name && await ClusterModel().exists({ name })) {
    return ([`Cluster already exists with name of '${name}'.`]);
  }
  return [];
}

export default {
  createCluster,
  clusterExists,
};
