import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from 'common/src/config/image_config.json';
import { initialiseImages, getNotebookInfo, getSiteInfo, getUserActionsForType } from './images';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/image_config.json')
  .reply(() => [200, data]);

describe('getNotebookInfo', () => {
  it('returns the correct notebookInfo', async () => {
    await initialiseImages();
    const notebookInfo = getNotebookInfo();
    expect(notebookInfo).toMatchSnapshot();
  });
});

describe('getSiteInfo', () => {
  it('returns the correct siteInfo', async () => {
    await initialiseImages();
    const siteInfo = getSiteInfo();
    expect(siteInfo).toMatchSnapshot();
  });
});

describe('getUserActionsForType', () => {
  it('returns to match snapshot for site type with no logs userActionOverrides', async () => {
    await initialiseImages();
    expect(getUserActionsForType('nbviewer')).toMatchSnapshot();
  });

  it('returns to match snapshot for site type with logs userActionOverrides', async () => {
    await initialiseImages();
    expect(getUserActionsForType('rshiny')).toMatchSnapshot();
  });

  it('returns all as true if cannot find type', async () => {
    await initialiseImages();
    expect(getUserActionsForType('does-not-exist')).toMatchSnapshot();
  });
});
