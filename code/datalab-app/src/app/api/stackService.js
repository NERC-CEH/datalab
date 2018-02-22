import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadStacks() {
  const query = `
    Stacks {
      stacks {
        id, displayName, name, type, description
      }
    }`;

  return gqlQuery(query).then(handleErrors('data.stacks'));
}

function loadStacksByCategory(category) {
  const query = `
    GetStacksByCategory($category: String!) {
      stacksByCategory(category: $category) {
        id, displayName, name, type, description
      }
    }`;
  return gqlQuery(query, { category }).then(handleErrors('data.stacksByCategory'));
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

  return gqlQuery(query, { name }).then(handleErrors('data.checkStackName'));
}

function checkStackMounts(volumeMount) {
  const query = `
    CheckStackMounts($volumeMount:  String!) {
      checkStackMounts(volumeMount: $volumeMount) {
        displayName, name, type
      }
    }`;

  return gqlQuery(query, { volumeMount }).then(handleErrors('data.checkStackMounts'));
}

function createStack(stack) {
  const mutation = `
    CreateStack($stack: StackCreationRequest) {
      createStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack }).then(handleErrors('data.stack'));
}

function deleteStack(stack) {
  const mutation = `
    DeleteStack($stack: StackDeletionRequest) {
      deleteStack(stack: $stack) {
        name
      }
    }`;

  return gqlMutation(mutation, { stack }).then(handleErrors('data.stack'));
}

function handleErrors(pathToData) {
  return (response) => {
    const { errors } = response;
    if (errors) {
      const firstError = errors[0];

      throw new Error(firstError.message || firstError);
    }

    return get(response, pathToData);
  };
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
