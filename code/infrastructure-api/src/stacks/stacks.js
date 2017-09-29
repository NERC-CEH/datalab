import find from 'lodash/find';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';

const STACKS = Object.freeze({
  JUPYTER: {
    name: 'jupyter',
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  RSTUDIO: {
    name: 'rstudio',
    create: rstudioStack.createRStudioStack,
    delete: rstudioStack.deleteRStudioStack,
  },
});

const getStack = name => find(STACKS, ['name', name]);

export default getStack;
