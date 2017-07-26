import moxios from 'moxios';
import logger from 'winston';
import vault from './vault';
import config from '../../config';

jest.mock('winston');

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
  logger.clearMessages();
});

const secretPath = 'datalab/files/files1';
const loginUrl = `${config.get('vaultApi')}/v1/auth/approle/login`;
const secretUrl = `${config.get('vaultApi')}/v1/secret/`;

describe('vault backend service', () => {
  it('should request tokens from the correct endpoint', () => {
    moxios.stubRequest(loginUrl, {
      status: 200,
      response: getSuccessfulLoginResponse(),
    });
    moxios.stubRequest(secretUrl + secretPath, {
      status: 200,
      response: getSuccessfulSecretResponse(),
    });

    return vault.requestPath(secretPath)
      .then((response) => {
        const requests = moxios.requests.__items; // eslint-disable-line no-underscore-dangle

        expect(requests.length).toEqual(2);
        expect(requests[0].config.data).toEqual(JSON.stringify({ role_id: 'undefinedrole' }));
        expect(requests[1].headers['X-Vault-Token']).toEqual('05d4a901-6353-33bd-b8f8-7e42f507ae6b');

        expect(response).toEqual({
          access_key: 'accesskey1',
          secret_key: 'secretkey1',
        });
      });
  });

  it('should handle a login failure', () => {
    moxios.stubRequest(loginUrl, {
      status: 400,
      response: getFailedLoginResponse(),
    });

    return vault.requestPath(secretPath)
      .then((response) => {
        expect(response).toEqual({
          message: 'Unable to retrieve secret',
        });
        expect(logger.getMessages()).toEqual([{
          message: 'Error retrieving secret %s: ',
          data: secretPath,
          metadata: getFailedLoginResponse(),
        }]);
      });
  });

  it('should handle a key request failure', () => {
    moxios.stubRequest(loginUrl, {
      status: 200,
      response: getSuccessfulLoginResponse(),
    });

    moxios.stubRequest(secretUrl + secretPath, {
      status: 404,
      response: getMissingKeyResponse(),
    });

    return vault.requestPath(secretPath)
      .then((response) => {
        expect(response).toEqual({
          message: 'Unable to retrieve secret',
        });
        expect(logger.getMessages()).toEqual([{
          message: 'Error retrieving secret %s: ',
          data: secretPath,
          metadata: getMissingKeyResponse(),
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

function getSuccessfulSecretResponse() {
  return {
    request_id: '80bbfa4d-abe9-0200-72bb-c99fa219ffb0',
    lease_id: '',
    renewable: false,
    lease_duration: 2764800,
    data: {
      access_key: 'accesskey1',
      secret_key: 'secretkey1',
    },
    wrap_info: null,
    warnings: null,
    auth: null,
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

function getMissingKeyResponse() {
  return {
    errors: [],
  };
}
