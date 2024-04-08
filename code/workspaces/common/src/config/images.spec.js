import { lowerCase, upperCase } from 'lodash';
import { getImageInfoForType, imageCategory, notebookList, siteList, stackList } from './images';

describe('stackList', () => {
  it('returns list of NOTEBOOKs and SITEs', () => {
    expect(stackList().sort()).toEqual(['jupyter', 'jupyterlab', 'nbviewer', 'panel', 'rshiny', 'rstudio', 'voila', 'vscode', 'zeppelin']);
  });
});

describe('notebookList', () => {
  it('returns list of NOTEBOOKs', () => {
    expect(notebookList().sort()).toEqual(['jupyter', 'jupyterlab', 'rstudio', 'vscode', 'zeppelin']);
  });
});

describe('siteList', () => {
  it('returns list of SITEs', () => {
    expect(siteList().sort()).toEqual(['nbviewer', 'panel', 'rshiny', 'voila']);
  });
});

describe('imageCategory', () => {
  it('returns category of image', () => {
    expect(imageCategory('dask')).toEqual('COMPUTE');
    expect(imageCategory('minio')).toEqual('INFRASTRUCTURE');
    expect(imageCategory('jupyter')).toEqual('ANALYSIS');
    expect(imageCategory('nbviewer')).toEqual('PUBLISH');
  });
});

describe('getImageInfoForType', () => {
  describe('returns the information for specified type when it exists', () => {
    const imageType = 'rstudio';

    it('and the type is provided in lowercase', () => {
      expect(getImageInfoForType(lowerCase(imageType))).toMatchSnapshot();
    });

    it('and the type is provided in uppercase', () => {
      expect(getImageInfoForType(upperCase(imageType))).toMatchSnapshot();
    });
  });

  it('throws an error when the specified type does not exist', () => {
    expect(() => getImageInfoForType('does not exist')).toThrow('Unable to find config for image of type "does not exist"');
  });
});
