import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import minioTokenService from './minioTokenService';
import vault from './vault/vault';

const mock = new MockAdapter(axios);

jest.mock('winston');

const vaultMock = jest.fn();
vault.requestStorageKeys = vaultMock;

beforeEach(() => {
  mock.reset();
});

afterEach(() => {
  logger.clearMessages();
});

afterAll(() => {
  mock.restore();
});

const storage = {
  name: 'disk-1',
  projectKey: 'testproj',
  internalEndpoint: 'http://files/minio',
};
const loginUrl = `${storage.internalEndpoint}/webrpc`;

describe('minioTokenService', () => {
  it('should request login token from minio', () => {
    vaultMock.mockImplementationOnce(() => (Promise.resolve({
      access_key: 'accessKey',
      secret_key: 'secretKey',
    })));

    mock.onPost(loginUrl).reply(200, getSuccessfulLoginResponse());

    return minioTokenService.requestMinioToken(storage)
      .then((token) => {
        expect(token).toEqual('returnedToken');
      });
  });

  it('should return undefined and log error if keys are not returned', () => {
    vaultMock.mockImplementationOnce(() => (Promise.resolve({})));

    return minioTokenService.requestMinioToken(storage)
      .then((token) => {
        expect(token).toBeUndefined();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should return undefined and log error if login fails', () => {
    vaultMock.mockImplementationOnce(() => (Promise.resolve({
      access_key: 'accessKey',
      secret_key: 'secretKey',
    })));

    mock.onPost(loginUrl).reply(200, getFailedLoginResponse());

    return minioTokenService.requestMinioToken(storage)
      .then((token) => {
        expect(token).toBeUndefined();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });
});

function getSuccessfulLoginResponse() {
  return {
    jsonrpc: 2.0,
    result: {
      token: 'returnedToken',
      uiVersion: '2017-06-24T08:35:58Z',
      id: 1,
    },
  };
}

function getFailedLoginResponse() {
  return {
    jsonrpc: '2.0',
    error: {
      code: 0,
      message: 'The access key ID you provided does not exist in our records',
      data: null,
    },
    id: 1,
  };
}
