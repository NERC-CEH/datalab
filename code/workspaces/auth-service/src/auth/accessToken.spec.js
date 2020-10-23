import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import requestAccessToken from './accessToken';
import getOidcConfig from '../config/oidcConfig';

jest.mock('../config/oidcConfig');

const oidcConfig = { token_endpoint: 'https://oidc-provider/oauth/token' };
// using mockImplementation rather than mockResolvedValue as the latter doesn't return
// the value correctly when called from the function under test.
getOidcConfig.mockImplementation(async () => oidcConfig);

const mock = new MockAdapter(axios);

describe('requestAccessToken', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('response with an access token', () => {
    mock.onPost(oidcConfig.token_endpoint)
      .reply(200, { access_token: 'expectedAccessToken' });

    return requestAccessToken()
      .then(token => expect(token).toBe('expectedAccessToken'));
  });

  it('throws error when unable to get access token', () => {
    mock.onPost(oidcConfig.token_endpoint)
      .reply(401);

    return requestAccessToken()
      .catch(err => expect(err.message).toBe('Unable to retrieve access token - Original message: "Request failed with status code 401"'));
  });
});
