import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import data from 'common/src/config/catalogue_config.json';
import { catalogueConfig, catalogueAvailable } from './catalogue';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/catalogue_config.json').reply(() => [200, data]);

describe('catalogueConfig', () => {
  it('returns correct configuration', async () => {
    const config = await catalogueConfig();
    expect(config).toMatchSnapshot();
  });
});

describe('catalogueConfig', () => {
  it('returns correct value for whether catalogue is available', async () => {
    expect(await catalogueAvailable()).toBe(true);
  });
});
