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

export default {
  createCluster: wrapWithAxiosErrorWrapper('Error creating cluster.', createCluster),
};
