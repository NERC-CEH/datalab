import { find } from 'lodash';
import { stackTypes } from 'common';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';
import zeppelinStack from './zeppelinStack';
import siteStack from './siteStack';

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
    create: siteStack.createSiteStack,
    delete: siteStack.deleteSiteStack,
  },
  NBVIEWER: {
    type: stackTypes.NBVIEWER,
    create: siteStack.createSiteStack,
    delete: siteStack.deleteSiteStack,
  },
  PANEL: {
    type: stackTypes.PANEL,
    create: siteStack.createSiteStack,
    delete: siteStack.deleteSiteStack,
  },
  VOILA: {
    type: stackTypes.VOILA,
    create: siteStack.createSiteStack,
    delete: siteStack.deleteSiteStack,
  },
});

const getStack = type => find(STACKS, ['type', type]);

export default { getStack };
