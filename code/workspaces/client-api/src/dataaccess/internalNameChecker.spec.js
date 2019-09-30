import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import internalNameChecker from './internalNameChecker';
import config from '../config';

const mock = new MockAdapter(axios);

const API_URL_BASE = config.get('infrastructureApi');

describe('checkNameUniqueness', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should call the infrastructure service', async () => {
    const url = `${API_URL_BASE}/stacks/project/name/isUnique`;
    mock.onGet(url).reply(200, { isUnique: true });

    const isUnique = await internalNameChecker('project', 'name', 'token');
    expect(isUnique).toBeTruthy();
  });
});
