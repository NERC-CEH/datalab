import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import vault from './vault';
import config from '../config/config';

const mock = new MockAdapter(axios);

jest.mock('winston');

beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const secretPath = 'datalab/notebooks/newnotebook';
const loginUrl = `${config.get('vaultApi')}/v1/auth/approle/login`;
const secretUrl = `${config.get('vaultApi')}/v1/secret/`;
const secret = { token: 'secret-token' };

describe('vault service', () => {
  it('should store secrets at the specified path', () => {
    mock.onPost(loginUrl).reply(200, getSuccessfulLoginResponse());
    mock.onPost(secretUrl + secretPath).reply(204);

    return vault.storeSecret(secretPath, secret)
      .then((response) => {
        expect(response.status).toBe(204);
      });
  });

  it('should handle a login failure', () => {
    mock.onPost(loginUrl).reply(400, getFailedLoginResponse());

    return vault.storeSecret(secretPath, secret)
      .then((response) => {
        expect(response).toEqual({
          message: 'Unable to retrieve secret',
        });
        expect(logger.getErrorMessages()).toEqual([{
          message: 'Error retrieving secret %s: ',
          data: secretPath,
          metadata: getFailedLoginResponse(),
        }]);
      });
  });
});

function getSuccessfulLoginResponse() {
  return {
    request_id: 'cc996bab-7eda-fe8a-7701-b85db1809911',
    lease_id: '',
    renewable: false,
    lease_duration: 0,
    data: null,
    wrap_info: null,
    warnings: null,
    auth: {
      client_token: '05d4a901-6353-33bd-b8f8-7e42f507ae6b',
      accessor: '737f3a52-1ba3-da4d-c2bd-ab316b858ffa',
      policies: ['datalab-policy', 'default'],
      metadata: null,
      lease_duration: 2764800,
      renewable: true,
    },
  };
}

function getFailedLoginResponse() {
  return {
    errors: [
      'failed to validate SecretID: failed to find secondary index for role_id ' +
      '"29fd4305-e856-fe04-6c59-65e3d4936e3"\n',
    ],
  };
}
