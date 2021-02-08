import axios from 'axios';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const infrastructureApi = config.get('infrastructureApi');

async function createAssetMetadata(metadata, token) {
  try {
    const { data } = await axios.post(
      `${infrastructureApi}/centralAssetRepo/metadata`,
      metadata,
      generateOptions(token),
    );
    return data;
  } catch (err) {
    return axiosErrorHandler('Error creating metadata')(err);
  }
}

function generateOptions(token) {
  return {
    headers: {
      authorization: token,
    },
  };
}

export default {
  createAssetMetadata,
};
