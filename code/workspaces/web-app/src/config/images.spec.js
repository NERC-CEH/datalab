import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from 'common/src/config/image_config.json';
import { imageConfig, getNotebookInfo, getSiteInfo, getUserActionsForType } from './images';

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

describe('getUserActionsForType', () => {
  it('returns to match snapshot for site type with no logs userActionOverrides', async () => {
    expect(await getUserActionsForType('nbviewer')).toMatchSnapshot();
  });

  it('returns to match snapshot for site type with logs userActionOverrides', async () => {
    expect(await getUserActionsForType('rshiny')).toMatchSnapshot();
  });

  it('returns all as true if cannot find type', async () => {
    expect(await getUserActionsForType('does-not-exist')).toMatchSnapshot();
  });
});
