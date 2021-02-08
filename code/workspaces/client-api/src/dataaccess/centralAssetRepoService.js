import axios from 'axios';
import config from '../config';

const infrastructureApi = config.get('infrastructureApi');

async function createAssetMetadata(metadata, token) {
  const { data } = await axios.post(
    `${infrastructureApi}/centralAssetRepo/metadata`,
    metadata,
    generateOptions(token),
  );
  return data;
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
