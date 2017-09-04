import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import notebookUrlService from './notebookUrlService';
import vault from './vault/vault';

const mock = new MockAdapter(axios);

jest.mock('winston');

const vaultMock = jest.fn();
vault.requestNotebookKeys = vaultMock;

beforeEach(() => {
  mock.reset();
});

afterEach(() => {
  logger.clearMessages();
});

afterAll(() => {
  mock.restore();
});

describe('notebookUrlService', () => {
  describe('processes zeppelin notebooks', () => {
    const notebook = {
      name: 'Zeppelin',
      type: 'zeppelin',
      url: 'http://zeppelin.datalab',
      internalEndpoint: 'http://zeppelin',
    };
    const loginUrl = `${notebook.internalEndpoint}/api/login`;

    it('to request login cookie from zeppelin', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        username: 'datalab',
        password: 'password',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' }, getSuccessfulLoginResponse());

      return notebookUrlService(notebook, 'user')
        .then((url) => {
          expect(url).toEqual('http://zeppelin.datalab/connect?token=8214bf3f-3988-45f2-a33c-58d4be09f02b');
        });
    });

    it('to return undefined and log error if keys are not returned', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({})));

      return notebookUrlService(notebook, 'user')
        .then((token) => {
          expect(token).toBeUndefined();
          expect(logger.getErrorMessages()).toMatchSnapshot();
        });
    });

    it('to return undefined and log error if login fails', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        username: 'datalab',
        password: 'password',
      })));

      mock.onPost(loginUrl).reply(403, getFailedLoginResponse());

      return notebookUrlService(notebook, 'user')
        .then((token) => {
          expect(token).toBeUndefined();
          expect(logger.getErrorMessages()).toMatchSnapshot();
        });
    });
  });

  describe('processes jupyter notebooks', () => {
    const notebook = {
      name: 'Jupyter',
      type: 'jupyter',
      url: 'http://jupyter.datalab',
      internalEndpoint: 'http://jupyter',
    };
    const loginUrl = `${notebook.internalEndpoint}/api/login`;

    it('returns the jupyter notebook token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        token: 'expectedToken',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' });

      return notebookUrlService(notebook, 'user')
        .then((url) => {
          expect(url).toEqual('http://jupyter.datalab/tree/?token=expectedToken');
        });
    });

    it('returns undefined if vault response has not token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        props: 'noToken',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' });

      return notebookUrlService(notebook, 'user')
        .then((token) => {
          expect(token).toBeUndefined();
        });
    });
  });
});

function getSuccessfulLoginResponse() {
  return {
    date: 'Fri, 28 Jul 2017 12:48:40 GMT, Friday, July 28, 2017 12:48:40 PM UTC, Fri, 28 Jul 2017 12:48:40 GMT',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'authorization,Content-Type',
    'access-control-allow-methods': 'POST, GET, OPTIONS, PUT, HEAD, DELETE',
    'set-cookie': [
      'rememberMe=deleteMe; Path=/; Max-Age=0; Expires=Thu, 27-Jul-2017 12:48:40 GMT',
      'JSESSIONID=ec35437e-c9b7-4203-8633-fd08bfde2b62; Path=/; HttpOnly',
      'JSESSIONID=deleteMe; Path=/; Max-Age=0; Expires=Thu, 27-Jul-2017 12:48:40 GMT',
      'JSESSIONID=8214bf3f-3988-45f2-a33c-58d4be09f02b; Path=/; HttpOnly',
      'rememberMe=deleteMe; Path=/; Max-Age=0; Expires=Thu, 27-Jul-2017 12:48:40 GMT',
    ],
    'content-type': 'application/json',
    connection: 'close',
    server: 'Jetty(9.2.15.v20160210)',
  };
}

function getFailedLoginResponse() {
  return {
    status: 'FORBIDDEN',
    message: '',
    body: '',
  };
}
