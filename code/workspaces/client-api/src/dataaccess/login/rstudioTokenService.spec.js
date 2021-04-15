import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import rstudioTokenService from './rstudioTokenService';
import encrypt from '../../vendor/encrypt.min';
import * as common from './common';

jest.mock('./common');
common.getCorrectAccessUrl = jest.fn().mockReturnValue('http://rstudio');

const mock = new MockAdapter(axios);

const encryptMock = jest.fn();
encrypt.encrypt = encryptMock;

beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

describe('RStudio token service', () => {
  const notebook = {
    internalEndpoint: 'http://rstudio',
  };

  const credentials = {
    username: 'rstudio',
    password: 'password',
  };

  const csrfToken = {
    'set-cookie': ['csrf-token=a9a40335-dc8d-43ee-bc65-7f2e93e44a4a;'],
  };

  const certificate = 'ABCD:12345678';

  const headers = {
    'set-cookie': [
      'user-id=rstudio|Thu%2C%2002%20Nov%202017%2008%3A26%3A46%20GMT|cybwuAyQf1YcC9qnf4XqUX1sMMXTZRmP5tfZRjBTW6E%3D; path=/; HttpOnly',
      'csrf-token=a9a40335-dc8d-43ee-bc65-7f2e93e44a4a; path=/',
    ],
  };

  it('should return tokens for successful login', () => {
    // Mock certificate request
    mock.onGet('http://rstudio/auth-public-key').reply(200, certificate);
    mock.onGet('http://rstudio/auth-sign-in').reply(200, {}, csrfToken);

    // Mock login request
    encryptMock.mockImplementationOnce(() => ('encryptedValue'));
    const expectedBody = 'persist=0&appUri=&clientPath=%2Fauth-sign-in&csrf-token=a9a40335-dc8d-43ee-bc65-7f2e93e44a4a&v=encryptedValue';
    mock.onPost('http://rstudio/auth-do-sign-in', expectedBody).reply(302, {}, headers);

    return rstudioTokenService.rstudioLogin(notebook)(credentials)
      .then((response) => {
        expect(response).toEqual({
          expires: 'Thu%2C%2002%20Nov%202017%2008%3A26%3A46%20GMT',
          token: 'cybwuAyQf1YcC9qnf4XqUX1sMMXTZRmP5tfZRjBTW6E%3D',
          csrfToken: 'a9a40335-dc8d-43ee-bc65-7f2e93e44a4a',
        });
      });
  });

  it('should throw error if the certificate cannot be loaded', () => {
    // Mock certificate request
    mock.onGet('http://rstudio/auth-public-key').reply(500);

    return rstudioTokenService.rstudioLogin(notebook)(credentials)
      .catch((error) => {
        expect(error.message).toEqual('Unable to retrieve RStudio certificate: Request failed with status code 500');
      });
  });

  it('should throw an error if the login is unsuccessful', () => {
    // Mock certificate request
    mock.onGet('http://rstudio/auth-public-key').reply(200, certificate);

    // Mock login request
    mock.onPost('http://rstudio/auth-do-sign-in').reply(500);

    return rstudioTokenService.rstudioLogin(notebook)(credentials)
      .catch((error) => {
        expect(error.message).toEqual('Unable to log in to RStudio: Request failed with status code 500');
      });
  });
});
