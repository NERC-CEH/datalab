import axios from 'axios';
import logger from 'winston';
import config from '../../config';

const infrastructureApi = config.get('infrastructureApi');

async function getStackSecret(stack, projectKey, userToken, key) {
  const { type: stackType, name: stackName } = stack;
  const requestParams = {
    projectKey, stackType, stackName,
  };
  if (key) {
    requestParams.key = key;
  }

  try {
    const { data } = await axios.get(
      `${infrastructureApi}/secrets/stack/`,
      {
        params: requestParams,
        ...getHeaders(userToken),
      },
    );
    return data;
  } catch (error) {
    logger.error(error);
    return { message: `unable to return secret for stack "${stack}" in project "${projectKey}".` };
  }
}

function getHeaders(userToken) {
  return {
    headers: {
      authorization: userToken,
    },
  };
}

export default {
  getStackSecret,
};
