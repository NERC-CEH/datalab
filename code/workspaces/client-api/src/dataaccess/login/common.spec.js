import config from '../../config';
import { getCorrectAccessUrl } from './common';

jest.mock('../../config');

describe('getCorrectAccessUrl', () => {
  const notebook = {
    internalEndpoint: 'internal-url',
    url: 'external-url',
  };

  const setDeployedInCluster = (returnValue) => {
    config.get.mockImplementationOnce((key) => {
      if (key === 'deployedInCluster') return returnValue;
      throw new Error('Unknown key');
    });
  };

  it('returns a notebooks internal URL when deployed in cluster', () => {
    setDeployedInCluster(true);
    expect(getCorrectAccessUrl(notebook)).toEqual(notebook.internalEndpoint);
  });

  it('returns notebooks external URL when not deployed in cluster', () => {
    setDeployedInCluster(false);
    expect(getCorrectAccessUrl(notebook)).toEqual(notebook.url);
  });
});
