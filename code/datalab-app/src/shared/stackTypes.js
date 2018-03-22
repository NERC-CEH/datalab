import { keyBy, capitalize } from 'lodash';

export const JUPYTER = 'jupyter';
export const ZEPPELIN = 'zeppelin';
export const RSTUDIO = 'rstudio';
export const RSHINY = 'rshiny';
export const NBVIEWER = 'nbviewer';
export const NFS_VOLUME = 'nfs';

export const ANALYSIS = 'analysis';
export const PUBLISH = 'publish';
export const DATA_STORE = 'dataStore';

const STACK_TYPES = [
  {
    name: JUPYTER,
    shortDescription: 'A Jupyter Notebook',
    category: ANALYSIS,
  },
  {
    name: RSTUDIO,
    shortDescription: 'An RStudio Server',
    category: ANALYSIS,
  },
  {
    name: ZEPPELIN,
    shortDescription: 'A Zeppelin Notebook',
    category: ANALYSIS,
  },
  {
    name: RSHINY,
    shortDescription: 'An RShiny Site',
    category: PUBLISH,
  },
  {
    name: NBVIEWER,
    shortDescription: 'An Jupyter Notebook Viewer Site',
    category: PUBLISH,
  },
  {
    name: NFS_VOLUME,
    shortDescription: 'A NFS volume',
    category: DATA_STORE,
  },
];

function getStackTypes() {
  const types = STACK_TYPES.map(type => ({ description: type.shortDescription, value: type.name }));
  return keyBy(types, type => type.value);
}

function getStackSelections(category) {
  return STACK_TYPES.filter(stack => stack.category === category)
    .map(stack => ({ text: capitalize(stack.name), value: stack.name }));
}

function getStackKeys() {
  return STACK_TYPES.map(type => type.name);
}

export { getStackTypes, getStackSelections, getStackKeys };
