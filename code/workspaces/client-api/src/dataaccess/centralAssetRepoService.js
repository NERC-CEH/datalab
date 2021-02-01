import axios from 'axios';
import config from '../config';

const infrastructureApi = config.get('infrastructureApi');

async function createAssetMetadata(metadata, token) {
  // await axios.post(
  //   // TODO: update URL to endpoint handling metadata creation
  //   `${infrastructureApi}/`,
  //   metadata,
  //   generateOptions(token),
  // );
  return metadata;
}

function generateOptions(token) {
  return {
    headers: {
      authorization: token,
    },
  };
}

export default {
  createMetadata: createAssetMetadata,
};
