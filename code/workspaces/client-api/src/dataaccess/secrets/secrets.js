import axios from 'axios';
import logger from 'winston';
import config from '../../config';

async function getStackSecret(stack, projectKey, userToken, key = null) {
  const { type: stackType, name: stackName } = stack;
  const infrastructureApi = config.get('infrastructureApi');
  const requestParams = createRequestParams(projectKey, stackType, stackName, key);

  try {
    const { data } = await axios.get(
      `${infrastructureApi}/secrets/stack`,
      createRequestConfig(requestParams, userToken),
    );
    return data;
  } catch (error) {
    logger.error(error);
    return { message: `unable to return secret for stack "${stack}" in project "${projectKey}".` };
  }
}

function createRequestParams(projectKey, stackType, stackName, key) {
  const requestParams = { projectKey, stackType, stackName };
  if (key) requestParams.key = key;
  return requestParams;
}

function createRequestConfig(requestParams, userToken) {
  return {
    params: requestParams,
    headers: {
      authorization: userToken,
    },
  };
}

export default {
  getStackSecret,
};
