import { keyBy, capitalize } from 'lodash';

export const JUPYTER = 'jupyter';
export const ZEPPELIN = 'zeppelin';
export const RSTUDIO = 'rstudio';

const NOTEBOOK_TYPES = [
  {
    name: JUPYTER,
    shortDescription: 'A Jupyter Notebook',
  },
  {
    name: RSTUDIO,
    shortDescription: 'An RStudio Server',
  },
  {
    name: ZEPPELIN,
    shortDescription: 'A Zeppelin Notebook',
  },
];

function getNotebookTypes() {
  const types = NOTEBOOK_TYPES.map(type => ({ description: type.shortDescription, value: type.name }));
  return keyBy(types, type => type.value);
}

function getNotebookSelections() {
  return NOTEBOOK_TYPES.map(type => ({ text: capitalize(type.name), value: type.name }));
}

function getNotebookKeys() {
  return NOTEBOOK_TYPES.map(type => type.name);
}

export { getNotebookTypes, getNotebookSelections, getNotebookKeys };
