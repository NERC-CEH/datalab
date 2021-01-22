import config from '../../config';

// eslint-disable-next-line import/prefer-default-export
export function getCorrectAccessUrl(notebook) {
  return config.get('deployedInCluster')
    ? notebook.internalEndpoint
    : notebook.url;
}
