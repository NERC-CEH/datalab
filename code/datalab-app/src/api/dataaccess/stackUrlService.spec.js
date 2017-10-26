import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import rstudioTokenService from './login/rstudioTokenService';
import stackUrlService from './stackUrlService';
import vault from './vault/vault';

const mock = new MockAdapter(axios);

jest.mock('winston');

const vaultMock = jest.fn();
vault.requestStackKeys = vaultMock;

const rstudioTokenServiceMock = jest.fn();
rstudioTokenService.rstudioLogin = rstudioTokenServiceMock;

beforeEach(() => {
  mock.reset();
});

afterEach(() => {
  logger.clearMessages();
});

afterAll(() => {
  mock.restore();
});

describe('stackUrlService', () => {
  describe('processes zeppelin notebooks', () => {
    const stack = {
      name: 'Zeppelin',
      type: 'zeppelin',
      url: 'http://zeppelin.datalab',
      internalEndpoint: 'http://zeppelin',
    };
    const loginUrl = `${stack.internalEndpoint}/api/login`;

    it('to request login cookie from zeppelin', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        username: 'datalab',
        password: 'password',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' }, getSuccessfulLoginResponse());

      return stackUrlService(stack, 'user')
        .then((url) => {
          expect(url).toEqual('http://zeppelin.datalab/connect?token=8214bf3f-3988-45f2-a33c-58d4be09f02b');
        });
    });

    it('to return undefined and log error if keys are not returned', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({})));

      return stackUrlService(stack, 'user')
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

      return stackUrlService(stack, 'user')
        .then((token) => {
          expect(token).toBeUndefined();
          expect(logger.getErrorMessages()).toMatchSnapshot();
        });
    });
  });

  describe('processes jupyter notebooks', () => {
    const stack = {
      name: 'Jupyter',
      type: 'jupyter',
      url: 'http://jupyter.datalab',
      internalEndpoint: 'http://jupyter',
    };
    const loginUrl = `${stack.internalEndpoint}/api/login`;

    it('returns the jupyter notebook token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        token: 'expectedToken',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' });

      return stackUrlService(stack, 'user')
        .then((url) => {
          expect(url).toEqual('http://jupyter.datalab/tree/?token=expectedToken');
        });
    });

    it('returns undefined if vault response has no token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        props: 'noToken',
      })));

      mock.onPost(loginUrl).reply(200, { message: 'message' });

      return stackUrlService(stack, 'user')
        .then((token) => {
          expect(token).toBeUndefined();
        });
    });
  });

  describe('processes rstudio notebooks', () => {
    const notebook = {
      name: 'RStudio',
      type: 'rstudio',
      url: 'http://rstudio.datalab',
      internalEndpoint: 'http://rstudio',
    };

    it('returns the rstudio notebook token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        username: 'datalab',
        password: 'password',
      })));

      const tokens = { expires: 'e', token: 't', csrfToken: 'c' };
      rstudioTokenServiceMock.mockImplementationOnce(inputNotebook => credentials => Promise.resolve(tokens));

      return stackUrlService(notebook, 'user')
        .then((url) => {
          expect(url).toEqual('http://rstudio.datalab/connect?username=datalab&expires=e&token=t&csrfToken=c');
        });
    });

    it('returns undefined if vault response has no token', () => {
      vaultMock.mockImplementationOnce(() => (Promise.resolve({
        props: 'noToken',
      })));

      rstudioTokenServiceMock.mockImplementationOnce(inputNotebook => credentials => Promise.reject(undefined));

      return stackUrlService(notebook, 'user')
        .then(token => expect(token).toBeUndefined());
    });
  });

  describe('processes nbviewers', () => {
    const notebook = {
      name: 'NBViewer',
      type: 'nbviewer',
      url: 'http://nbviewer.datalab',
      internalEndpoint: 'http://nbviewer',
    };

    it('returns the nbviewer localfile url', () =>
      stackUrlService(notebook, 'user')
        .then(url => expect(url).toEqual('http://nbviewer.datalab/localfile')));
  });

  describe('Unknown types', () => {
    it('returns url for unknown types', () => {
      const notebook = {
        name: 'Unknown',
        type: 'unknown',
        url: 'http://unknown.datalab',
        internalEndpoint: 'http://unknown',
      };

      return stackUrlService(notebook, 'user')
        .then(url => expect(url).toEqual(notebook.url));
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
