import { keyBy, find, capitalize } from 'lodash';

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

function getCategoryForType(name) {
  return find(STACK_TYPES, stack => stack.name === name).category;
}

export { getStackTypes, getStackSelections, getStackKeys, getCategoryForType };
