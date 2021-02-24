import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import data from 'common/src/config/web_auth_config.json';
import { initialiseAuth, getAuth } from './auth';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/web_auth_config.json').reply(() => [200, data]);

describe('authConfig', () => {
  it('returns correct configuration', async () => {
    await initialiseAuth();
    const auth = getAuth();
    expect(auth.authConfig).toMatchSnapshot();
  });
});
