const JUPYTER = 'jupyter';
const JUPYTERLAB = 'jupyterlab';
const ZEPPELIN = 'zeppelin';
const RSTUDIO = 'rstudio';
const RSHINY = 'rshiny';
const NBVIEWER = 'nbviewer';
const LEGACY_GLUSTERFS_VOLUME = '1';
const GLUSTERFS_VOLUME = 'glusterfs';
const NFS_VOLUME = 'nfs';
const PROJECT = 'project';

const ANALYSIS = 'ANALYSIS';
const PUBLISH = 'PUBLISH';
const DATA_STORE = 'dataStore';

const STACK_TYPES = [
  {
    name: JUPYTER,
    shortDescription: 'A Jupyter Notebook',
    category: ANALYSIS,
  },
  {
    name: JUPYTERLAB,
    shortDescription: 'A Jupyter Lab',
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
    name: GLUSTERFS_VOLUME,
    shortDescription: 'A GlusterFS volume',
    category: DATA_STORE,
  },
  {
    name: NFS_VOLUME,
    shortDescription: 'A NFS volume',
    category: DATA_STORE,
  },
];

function getCategoryFromTypeName(name) {
  const stack = STACK_TYPES.filter(item => item.name === name);
  return stack && stack.length ? stack[0].category : null;
}

export {
  ANALYSIS,
  DATA_STORE,
  JUPYTER,
  JUPYTERLAB,
  NBVIEWER,
  LEGACY_GLUSTERFS_VOLUME,
  GLUSTERFS_VOLUME,
  NFS_VOLUME,
  PROJECT,
  PUBLISH,
  RSHINY,
  RSTUDIO,
  ZEPPELIN,
  getCategoryFromTypeName,
};
