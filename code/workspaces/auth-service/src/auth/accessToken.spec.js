import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import requestAccessToken, { authOAuthEndpoint } from './accessToken';

const mock = new MockAdapter(axios);

describe('requestAccessToken', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('response with an access token', () => {
    mock.onPost(authOAuthEndpoint)
      .reply(200, { access_token: 'expectedAccessToken' });

    return requestAccessToken()
      .then(token => expect(token).toBe('expectedAccessToken'));
  });

  it('throws error when unable to get access token', () => {
    mock.onPost(authOAuthEndpoint)
      .reply(401);

    return requestAccessToken()
      .catch(err => expect(err.message).toBe('Unable to retrieve access token - Original message: "Request failed with status code 401"'));
  });
});
