import { find } from 'lodash';
import { stackTypes } from 'common';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';
import zeppelinStack from './zeppelinStack';
import rshinyStack from './rshinyStack';
import nbviewerStack from './nbviewerStack';

export const SELECTOR_LABEL = 'user-pod';

// NOTE: All other stack details should come from 'common/src/config/images'
const STACKS = Object.freeze({
  JUPYTER: {
    type: stackTypes.JUPYTER,
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  JUPYTERLAB: {
    type: stackTypes.JUPYTERLAB,
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  ZEPPELIN: {
    type: stackTypes.ZEPPELIN,
    create: zeppelinStack.createZeppelinStack,
    delete: zeppelinStack.deleteZeppelinStack,
  },
  RSTUDIO: {
    type: stackTypes.RSTUDIO,
    create: rstudioStack.createRStudioStack,
    delete: rstudioStack.deleteRStudioStack,
  },
  RSHINY: {
    type: stackTypes.RSHINY,
    create: rshinyStack.createRShinyStack,
    delete: rshinyStack.deleteRShinyStack,
  },
  NBVIEWER: {
    type: stackTypes.NBVIEWER,
    create: nbviewerStack.createNbViewerStack,
    delete: nbviewerStack.deleteNbViewerStack,
  },
});

const getStack = type => find(STACKS, ['type', type]);

export default { getStack };
