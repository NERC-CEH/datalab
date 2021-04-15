import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import data from 'common/src/config/catalogue_asset_repo_config.json';
import { initialiseCatalogue, getCatalogue } from './catalogue';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/catalogue_asset_repo_config.json').reply(() => [200, data]);

describe('catalogue', () => {
  it('returns correct configuration', async () => {
    await initialiseCatalogue();
    const catalogue = getCatalogue();
    expect(catalogue).toMatchSnapshot();
  });
});
