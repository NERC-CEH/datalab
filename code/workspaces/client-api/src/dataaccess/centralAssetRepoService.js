import axios from 'axios';
import { ApolloError } from 'apollo-server';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const infrastructureApi = () => axios.create({
  baseURL: `${config.get('infrastructureApi')}/centralAssetRepo`,
});

async function createAssetMetadata(metadata, token) {
  const { data } = await infrastructureApi().post(
    '/metadata',
    metadata,
    generateRequestConfig(token),
  );
  return data;
}

async function listCentralAssets(token) {
  const { data } = await infrastructureApi().get(
    '/metadata',
    generateRequestConfig(token),
  );
  return data;
}

async function listCentralAssetsAvailableToProject(projectKey, token) {
  const { data } = await infrastructureApi().get(
    `/metadata/${projectKey}`,
    generateRequestConfig(token),
  );
  return data;
}

function generateRequestConfig(token) {
  return {
    headers: { authorization: token },
  };
}

async function axiosErrorWrapper(callback, ...args) {
  try {
    return await callback(...args);
  } catch (error) {
    handleAxiosError(error);
  }
}

function handleAxiosError(error) {
  const { response: { status, data } } = error;
  if (status === 401 || status === 403) {
    throw new ApolloError(data.errors, 'UNAUTHORISED');
  }
  throw error;
}

function wrapWithAxiosErrorWrapper(fn) {
  return (...args) => axiosErrorWrapper(fn, ...args);
}

export default {
  createAssetMetadata: wrapWithAxiosErrorWrapper(createAssetMetadata),
  listCentralAssets: wrapWithAxiosErrorWrapper(listCentralAssets),
  listCentralAssetsAvailableToProject: wrapWithAxiosErrorWrapper(listCentralAssetsAvailableToProject),
};
