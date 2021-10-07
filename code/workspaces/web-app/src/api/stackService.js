import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadStacks(projectKey) {
  const query = `
    GetStacks($projectKey: String!) {
      stacks {
        id, projectKey, displayName, name, users, type, category, description, status, shared, visible, version, assets { assetId, name, version, fileLocation }
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.stacks'));
}

function loadStacksByCategory(projectKey, category) {
  const query = `
    GetStacksByCategory($params: StacksByCategoryRequest) {
      stacksByCategory(params: $params) {
        id, projectKey, displayName, name, users, type, category, description, status, shared, visible, version, assets { assetId, name, version, fileLocation }
      }
    }`;

  return gqlQuery(query, { params: { projectKey, category } })
    .then(errorHandler('data.stacksByCategory'));
}

function getUrl(projectKey, id) {
  const query = `
    GetUrl($projectKey: String!, $id: ID!) {
      stack(projectKey: $projectKey, id: $id) {
        redirectUrl
      }
    }`;

  return gqlQuery(query, { projectKey, id })
    .then(errorHandler('data.stack'))
    .then((stack) => {
      if (!stack.redirectUrl) {
        throw new Error('Missing stack URL');
      }
      return stack;
    });
}

function createStack(stackWithAssets) {
  const stack = {
    ...stackWithAssets,
    assetIds: stackWithAssets.assets ? stackWithAssets.assets.map(asset => asset.assetId) : [],
  };
  delete stack.assets;
  const mutation = `
    CreateStack($stack: StackCreationRequest) {
      createStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack })
    .then(errorHandler('data.stack'));
}

function deleteStack(stack) {
  const mutation = `
    DeleteStack($stack: StackDeletionRequest) {
      deleteStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack })
    .then(errorHandler('data.stack'));
}

function restartStack(stack) {
  const mutation = `
    RestartStack($stack: StackRestartRequest) {
      restartStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack })
    .then(errorHandler('data.stack'));
}

const scaleStack = async (stack, replicas) => {
  const operation = replicas > 0 ? 'scaleupStack' : 'scaledownStack';
  const mutation = `
    ScaleStack($stack: ScaleRequest) {
      ${operation}(stack: $stack) {
        message
      }
    }`;

  const response = await gqlMutation(mutation, { stack });
  return errorHandler(`data.${replicas > 0 ? 'scaleupStack' : 'scaledownStack'}`)(response);
};

function getLogs(projectKey, name) {
  const query = `
    Logs($projectKey: String!, $name: String!) {
      logs(projectKey: $projectKey, name: $name)
    }`;

  return gqlQuery(query, { projectKey, name })
    .then(errorHandler('data.logs'));
}

function editStack(stackWithAssets) {
  const stack = {
    ...stackWithAssets,
    assetIds: stackWithAssets.assets ? stackWithAssets.assets.map(asset => asset.assetId) : [],
  };
  delete stack.assets;
  const mutation = `
    UpdateStack($stack: StackUpdateRequest) {
      updateStack(stack: $stack) {
        name
        displayName
        description
        shared
        assets { assetId, name, version, fileLocation }
      }
    }`;

  return gqlMutation(mutation, { stack })
    .then(errorHandler('data.stack'));
}

export default {
  loadStacks,
  loadStacksByCategory,
  getUrl,
  createStack,
  deleteStack,
  getLogs,
  editStack,
  restartStack,
  scaleStack,
};
