import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import minioTokenService from './minioTokenService';
import secrets from './secrets/secrets';
import * as common from './login/common';

const mock = new MockAdapter(axios);

jest.mock('winston');

const getStackSecretMock = jest.fn();
secrets.getStackSecret = getStackSecretMock;

jest.mock('./login/common');
common.getCorrectAccessUrl = jest.fn().mockImplementation(notebook => notebook.internalEndpoint);

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
  it('should request login token from minio', async () => {
    getStackSecretMock.mockImplementationOnce(() => (Promise.resolve({
      access_key: 'accessKey',
      secret_key: 'secretKey',
    })));
    mock.onPost(loginUrl).reply(200, getSuccessfulLoginResponse());

    const token = await minioTokenService.requestMinioToken(storage);

    expect(token).toEqual('returnedToken');
  });

  it('should return undefined and log error if keys are not returned', () => {
    getStackSecretMock.mockImplementationOnce(() => (Promise.resolve({})));

    return minioTokenService.requestMinioToken(storage)
      .then((token) => {
        expect(token).toBeUndefined();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should return undefined and log error if login fails', () => {
    getStackSecretMock.mockImplementationOnce(() => (Promise.resolve({
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
