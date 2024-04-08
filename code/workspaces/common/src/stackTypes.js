// NOTE: A few files need to specify in-code behaviour for stack types.
// All other stack details should come from 'common/src/config/images'

const DASK = 'DASK';
const JUPYTER = 'jupyter';
const JUPYTERLAB = 'jupyterlab';
const NBVIEWER = 'nbviewer';
const PANEL = 'panel';
const PROJECT = 'project';
const RSHINY = 'rshiny';
const RSTUDIO = 'rstudio';
const SPARK = 'SPARK';
const STREAMLIT = 'streamlit';
const VOILA = 'voila';
const VSCODE = 'vscode';
const ZEPPELIN = 'zeppelin';
const singleHostNameTypes = [JUPYTER, JUPYTERLAB, RSTUDIO];

// returns true if this stack type can be handled by a single host name
const isSingleHostName = type => singleHostNameTypes.includes(type);

// base path for resources
const basePath = (type, projectKey, name) => (isSingleHostName(type)
  ? `/resource/${projectKey}/${name}`
  : '/');

export {
  DASK,
  JUPYTER,
  JUPYTERLAB,
  NBVIEWER,
  PANEL,
  PROJECT,
  RSHINY,
  RSTUDIO,
  SPARK,
  STREAMLIT,
  VOILA,
  VSCODE,
  ZEPPELIN,
  isSingleHostName,
  basePath,
};
