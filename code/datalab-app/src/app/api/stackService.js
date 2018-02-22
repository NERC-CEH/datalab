import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadStacks() {
  const query = `
    Stacks {
      stacks {
        id, displayName, name, type, description
      }
    }`;

  return gqlQuery(query)
    .then(errorHandler('data.stacks'));
}

function loadStacksByCategory(category) {
  const query = `
    GetStacksByCategory($category: String!) {
      stacksByCategory(category: $category) {
        id, displayName, name, type, description
      }
    }`;
  return gqlQuery(query, { category })
    .then(errorHandler('data.stacksByCategory'));
}

function getUrl(id) {
  const query = `
    GetUrl($id: ID!) {
      stack(id: $id) {
        redirectUrl
      }
    }`;

  return gqlQuery(query, { id })
    .then(errorHandler('data.stack'))
    .then((stack) => {
      if (!stack.redirectUrl) {
        throw new Error('Missing stack URL');
      }
      return stack;
    });
}

function checkStackName(name) {
  const query = `
    CheckStackName($name: String!) {
      checkStackName(name: $name) { 
        id 
      }
    }`;

  return gqlQuery(query, { name })
    .then(errorHandler('data.checkStackName'));
}

function checkStackMounts(volumeMount) {
  const query = `
    CheckStackMounts($volumeMount:  String!) {
      checkStackMounts(volumeMount: $volumeMount) {
        displayName, name, type
      }
    }`;

  return gqlQuery(query, { volumeMount })
    .then(errorHandler('data.checkStackMounts'));
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
  checkStackName,
  checkStackMounts,
  createStack,
  deleteStack,
};
