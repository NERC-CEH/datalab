import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadNotebooks() {
  const query = `
      Notebooks {
        notebooks {
          id, displayName, name, type, description
        }
      }`;

  return gqlQuery(query).then(res => get(res, 'data.notebooks'));
}

function getUrl(id) {
  const query = `
      GetUrl($id: ID!) {
        notebook(id: $id) {
          redirectUrl
        }
      }`;

  return gqlQuery(query, { id })
    .then(res => get(res, 'data.notebook'))
    .then((notebook) => {
      if (!notebook.redirectUrl) {
        throw new Error('Missing notebook URL');
      }
      return notebook;
    });
}

function checkNotebookName(notebookName) {
  const query = `CheckNotebookName($notebookName: String!) {
    checkNotebookName(name: $notebookName) { 
      id 
    }
  }`;

  return gqlQuery(query, { notebookName }).then(res => get(res, 'data.checkNotebookName'));
}

function createNotebook(notebook) {
  const mutation = `
    CreateNotebook($notebook: NotebookCreationRequest) {
      createNotebook(notebook: $notebook) {
        name
      }
    }`;

  return gqlMutation(mutation, { notebook }).then(handleMutationErrors);
}

function deleteNotebook(notebook) {
  const mutation = `
    DeleteNotebook($notebook: NotebookDeletionRequest) {
      deleteNotebook(notebook: $notebook) {
        name
      }
    }
  `;

  return gqlMutation(mutation, { notebook }).then(handleMutationErrors);
}

function handleMutationErrors(response) {
  if (response.errors) {
    throw new Error(response.errors[0]);
  }
  return get(response, 'data.notebook');
}

export default {
  loadNotebooks,
  getUrl,
  checkNotebookName,
  createNotebook,
  deleteNotebook,
};
