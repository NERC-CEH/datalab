import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadStacks() {
  const query = `
    Stacks {
      stacks {
        id, displayName, name, type, description
      }
    }`;

  return gqlQuery(query).then(res => get(res, 'data.stacks'));
}

function loadStacksByCategory(category) {
  const query = `
    GetStacksByCategory($category: String!) {
      stacksByCategory(category: $category) {
        id, displayName, name, type, description
      }
    }`;
  return gqlQuery(query, { category }).then(res => get(res, 'data.stacksByCategory'));
}

function getUrl(id) {
  const query = `
    GetUrl($id: ID!) {
      stack(id: $id) {
        redirectUrl
      }
    }`;

  return gqlQuery(query, { id })
    .then(res => get(res, 'data.stack'))
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

  return gqlQuery(query, { name }).then(res => get(res, 'data.checkStackName'));
}

function checkStackMounts(volumeMount) {
  const query = `
    CheckStackMounts($volumeMount:  String!) {
      checkStackMounts(volumeMount: $volumeMount) {
        displayName, name, type
      }
    }`;

  return gqlQuery(query, { volumeMount }).then(res => get(res, 'data.checkStackMounts'));
}

function createStack(stack) {
  const mutation = `
    CreateStack($stack: StackCreationRequest) {
      createStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack }).then(handleMutationErrors);
}

function deleteStack(stack) {
  const mutation = `
    DeleteStack($stack: StackDeletionRequest) {
      deleteStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack }).then(handleMutationErrors);
}

function handleMutationErrors(response) {
  if (response.errors) {
    throw new Error(response.errors[0]);
  }
  return get(response, 'data.stack');
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
