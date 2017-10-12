import { keyBy, capitalize } from 'lodash';

export const JUPYTER = 'jupyter';
export const ZEPPELIN = 'zeppelin';
export const RSTUDIO = 'rstudio';
export const RSHINY = 'rshiny';

export const ANALYSIS = 'analysis';
export const PUBLISH = 'publish';

const STACK_TYPES = [
  {
    name: JUPYTER,
    shortDescription: 'A Jupyter Notebook',
    type: ANALYSIS,
  },
  {
    name: RSTUDIO,
    shortDescription: 'An RStudio Server',
    type: ANALYSIS,
  },
  {
    name: ZEPPELIN,
    shortDescription: 'A Zeppelin Notebook',
    type: ANALYSIS,
  },
  {
    name: RSHINY,
    shortDescription: 'An RShiny Site',
    type: PUBLISH,
  },
];

function getStackTypes() {
  const types = STACK_TYPES.map(type => ({ description: type.shortDescription, value: type.name }));
  return keyBy(types, type => type.value);
}

function getStackSelections(type) {
  return STACK_TYPES.filter(stack => stack.type === type)
    .map(stack => ({ text: capitalize(stack.name), value: stack.name }));
}

function getStackKeys() {
  return STACK_TYPES.map(type => type.name);
}

export { getStackTypes, getStackSelections, getStackKeys };
