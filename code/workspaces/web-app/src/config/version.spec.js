import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { initialiseVersion, getVersion } from './version';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/version.json').reply(() => [200, { version: 'test version' }]);

describe('version', () => {
  it('returns correct configuration', async () => {
    await initialiseVersion();
    const version = getVersion();
    expect(version).toEqual('test version');
  });
});
