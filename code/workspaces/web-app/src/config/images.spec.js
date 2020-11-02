import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from 'common/src/config/image_config.json';
import { imageConfig, getNotebookInfo, getSiteInfo } from './images';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/image_config.json')
  .reply(() => [200, data]);

describe('imageConfig', () => {
  it('returns the correct configuration', async () => {
    const config = await imageConfig();
    expect(config).toMatchSnapshot();
  });
});

describe('getNotebookInfo', () => {
  it('returns the correct notebookInfo', async () => {
    const notebookInfo = await getNotebookInfo();
    expect(notebookInfo).toMatchSnapshot();
  });
});

describe('getSiteInfo', () => {
  it('returns the correct siteInfo', async () => {
    const siteInfo = await getSiteInfo();
    expect(siteInfo).toMatchSnapshot();
  });
});
