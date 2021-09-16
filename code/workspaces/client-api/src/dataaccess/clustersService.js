import axios from 'axios';
import config from '../config';
import { wrapWithAxiosErrorWrapper } from '../util/errorHandlers';
import requestConfig from '../util/requestConfig';

const infrastructureApi = () => axios.create({
  baseURL: `${config.get('infrastructureApi')}/clusters`,
});

async function createCluster(cluster, token) {
  const { data } = await infrastructureApi().post(
    '/',
    cluster,
    requestConfig(token),
  );
  return data;
}

async function deleteCluster(cluster, token) {
  const { data } = await infrastructureApi().delete(
    `/${cluster.projectKey}/${cluster.type}/${cluster.name}`,
    requestConfig(token),
  );
  return data;
}

async function getClusters(projectKey, token) {
  const { data } = await infrastructureApi().get(
    `/?projectKey=${projectKey}`,
    requestConfig(token),
  );
  return data;
}

async function getClustersByMount(projectKey, mount, token) {
  const { data } = await infrastructureApi().get(
    `/${projectKey}/mount/${mount}`,
    requestConfig(token),
  );
  return data;
}

export default {
  createCluster: wrapWithAxiosErrorWrapper('Error creating cluster.', createCluster),
  deleteCluster: wrapWithAxiosErrorWrapper('Error deleting cluster.', deleteCluster),
  getClusters: wrapWithAxiosErrorWrapper('Error getting clusters.', getClusters),
  getClustersByMount: wrapWithAxiosErrorWrapper('Error getting clusters by mount.', getClustersByMount),
};
