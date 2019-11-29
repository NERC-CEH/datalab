import { filter, find } from 'lodash';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';
import zeppelinStack from './zeppelinStack';
import rshinyStack from './rshinyStack';
import nbviewerStack from './nbviewerStack';

export const ANALYSIS = 'analysis';
export const PUBLISH = 'publish';

export const SELECTOR_LABEL = 'user-pod';

export const STACKS = Object.freeze({
  JUPYTER: {
    name: 'jupyter',
    category: ANALYSIS,
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  JUPYTERLAB: {
    name: 'jupyterlab',
    category: ANALYSIS,
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  ZEPPELIN: {
    name: 'zeppelin',
    category: ANALYSIS,
    create: zeppelinStack.createZeppelinStack,
    delete: zeppelinStack.deleteZeppelinStack,
  },
  RSTUDIO: {
    name: 'rstudio',
    category: ANALYSIS,
    create: rstudioStack.createRStudioStack,
    delete: rstudioStack.deleteRStudioStack,
  },
  RSHINY: {
    name: 'rshiny',
    category: PUBLISH,
    create: rshinyStack.createRShinyStack,
    delete: rshinyStack.deleteRShinyStack,
  },
  NBVIEWER: {
    name: 'nbviewer',
    category: PUBLISH,
    create: nbviewerStack.createNbViewerStack,
    delete: nbviewerStack.deleteNbViewerStack,
  },
});

const getStack = name => find(STACKS, ['name', name]);

const getNamesByCategory = category => filter(STACKS, ['category', category])
  .map(stacks => stacks.name);

export default { getStack, getNamesByCategory };
