import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadNotebooks() {
  const query = `
      Notebooks {
        notebooks {
          id, displayName, type
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

function createNotebook(notebook) {
  const mutation = `
    CreateNotebook($notebook: NotebookCreationRequest) {
      createNotebook(notebook: $notebook) {
        name
      }
    }`;

  return gqlMutation(mutation, { notebook }).then(res => get(res, 'data.notebook'));
}

function checkNotebookName(notebookName) {
  return request.post(apiURL, { query: `{ checkNotebookName(name: "${notebookName}") { id } }` })
    .then(response => get(response, 'data.data.checkNotebookName'));
}

export default {
  loadNotebooks,
  getUrl,
  createNotebook,
  checkNotebookName,
};
