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

function getUrl(id) {
  const query = `
      GetUrl($id: ID!) {
        stack(id: $id) {
          redirectUrl
        }
      }`;

  return gqlQuery(query, { id })
    .then(res => get(res, 'data.stack'))
    .then((notebook) => {
      if (!notebook.redirectUrl) {
        throw new Error('Missing stack URL');
      }
      return notebook;
    });
}

function checkStackName(name) {
  const query = `CheckStackName($name: String!) {
    checkStackName(name: $name) { 
      id 
    }
  }`;

  return gqlQuery(query, { name }).then(res => get(res, 'data.checkStackName'));
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
    }
  `;

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
  getUrl,
  checkStackName,
  createStack,
  deleteStack,
};
