import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadStacks(projectKey) {
  const query = `
    GetStacks($projectKey: String!) {
      stacks {
        id, projectKey, displayName, name, users, type, description, status, shared, visible
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.stacks'));
}

function loadStacksByCategory(projectKey, category) {
  const query = `
    GetStacksByCategory($params: StacksByCategoryRequest) {
      stacksByCategory(params: $params) {
        id, projectKey, displayName, name, users, type, description, status, shared, visible
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

function createStack(stack) {
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

export default {
  loadStacks,
  loadStacksByCategory,
  getUrl,
  createStack,
  deleteStack,
};
