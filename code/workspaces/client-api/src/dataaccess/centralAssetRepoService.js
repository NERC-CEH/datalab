import axios from 'axios';
import config from '../config';
import { wrapWithAxiosErrorWrapper } from '../util/errorHandlers';
import requestConfig from '../util/requestConfig';

const infrastructureApi = () => axios.create({
  baseURL: `${config.get('infrastructureApi')}/centralAssetRepo`,
});

async function createAssetMetadata(metadata, token) {
  const { data } = await infrastructureApi().post(
    '/metadata',
    metadata,
    requestConfig(token),
  );
  return data;
}

async function updateAssetMetadata({ assetId, ownerUserIds, visible, projectKeys }, token) {
  const { data } = await infrastructureApi().put(
    `/metadata/${assetId}`,
    { ownerUserIds, visible, projectKeys },
    requestConfig(token),
  );
  return data;
}

async function listCentralAssets(token) {
  const { data } = await infrastructureApi().get(
    '/metadata',
    requestConfig(token),
  );
  return data;
}

async function listCentralAssetsAvailableToProject(projectKey, token) {
  const { data } = await infrastructureApi().get(
    `/metadata?projectKey=${projectKey}`,
    requestConfig(token),
  );
  return data;
}

async function listCentralAssetsAvailableToUser(token) {
  const { data } = await infrastructureApi().get(
    '/allowedMetadata',
    requestConfig(token),
  );
  return data;
}

async function getAssetByIdAndProjectKey(assetId, projectKey, token) {
  const { data } = await infrastructureApi().get(
    `/metadata/${assetId}?projectKey=${projectKey}`,
    requestConfig(token),
  );
  return data;
}

export default {
  createAssetMetadata: wrapWithAxiosErrorWrapper('Error creating metadata.', createAssetMetadata),
  updateAssetMetadata: wrapWithAxiosErrorWrapper('Error updating metadata.', updateAssetMetadata),
  listCentralAssets: wrapWithAxiosErrorWrapper('Error listing metadata.', listCentralAssets),
  listCentralAssetsAvailableToProject: wrapWithAxiosErrorWrapper('Error listing metadata from project.', listCentralAssetsAvailableToProject),
  listCentralAssetsAvailableToUser: wrapWithAxiosErrorWrapper('Error listing metadata for user.', listCentralAssetsAvailableToUser),
  getAssetByIdAndProjectKey: wrapWithAxiosErrorWrapper('Error getting metadata by assetId and projectKey', getAssetByIdAndProjectKey),
};
