import axios from 'axios';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const infrastructureApi = () => axios.create({
  baseURL: config.get('infrastructureApi'),
});

async function createAssetMetadata(metadata, token) {
  const { data } = await infrastructureApi().post(
    '/centralAssetRepo/metadata',
    metadata,
    generateRequestConfig(token),
  );
  return data;
}

async function listCentralAssetsAvailableToProject(projectKey, token) {
  const { data } = await infrastructureApi().get(
    '/centralAssetRepo/metadata',
    generateRequestConfig(token, { projectKey }),
  );
  return data;
}

function generateRequestConfig(token, params) {
  return {
    headers: { authorization: token },
    params,
  };
}

export default {
  createAssetMetadata,
  listCentralAssetsAvailableToProject,
};
