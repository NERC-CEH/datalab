import { keyBy, capitalize } from 'lodash';

export const JUPYTER = 'jupyter';
export const ZEPPELIN = 'zeppelin';
export const RSTUDIO = 'rstudio';
export const RSHINY = 'rshiny';

const STACK_TYPES = [
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
  {
    name: RSHINY,
    shortDescription: 'An RShiny Site',
  },
];

function getStackTypes() {
  const types = STACK_TYPES.map(type => ({ description: type.shortDescription, value: type.name }));
  return keyBy(types, type => type.value);
}

function getStackSelections() {
  return STACK_TYPES.map(type => ({ text: capitalize(type.name), value: type.name }));
}

function getStackKeys() {
  return STACK_TYPES.map(type => type.name);
}

export { getStackTypes, getStackSelections, getStackKeys };
