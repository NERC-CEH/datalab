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

async function axiosErrorWrapper(message, fn, ...args) {
  try {
    return await fn(...args);
  } catch (error) {
    return handleAxiosError(message, error);
  }
}

function handleAxiosError(message, error) {
  const { response: { status, data } } = error;
  if (status === 401 || status === 403) {
    throw new ApolloError(data.errors, 'UNAUTHORISED');
  }
  axiosErrorHandler(message)(error);
}

function wrapWithAxiosErrorWrapper(message, fn) {
  return (...args) => axiosErrorWrapper(message, fn, ...args);
}

export default {
  createAssetMetadata: wrapWithAxiosErrorWrapper('Error creating metadata.', createAssetMetadata),
  listCentralAssets: wrapWithAxiosErrorWrapper('Error listing metadata.', listCentralAssets),
  listCentralAssetsAvailableToProject: wrapWithAxiosErrorWrapper('Error listing metadata from project.', listCentralAssetsAvailableToProject),
};
