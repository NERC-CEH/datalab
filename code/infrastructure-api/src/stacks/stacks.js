import { find } from 'lodash';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';
import zeppelinStack from './zeppelinStack';
import rshinyStack from './rshinyStack';
import nbviewerStack from './nbviewerStack';

export const STACKS = Object.freeze({
  JUPYTER: {
    name: 'jupyter',
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  ZEPPELIN: {
    name: 'zeppelin',
    create: zeppelinStack.createZeppelinStack,
    delete: zeppelinStack.deleteZeppelinStack,
  },
  RSTUDIO: {
    name: 'rstudio',
    create: rstudioStack.createRStudioStack,
    delete: rstudioStack.deleteRStudioStack,
  },
  RSHINY: {
    name: 'rshiny',
    create: rshinyStack.createRShinyStack,
    delete: rshinyStack.deleteRShinyStack,
  },
  NBVIEWER: {
    name: 'nbviewer',
    create: nbviewerStack.createNbViewerStack,
    delete: nbviewerStack.deleteNbViewerStack,
  },
});

const getStack = name => find(STACKS, ['name', name]);

export default getStack;
