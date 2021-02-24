import MockAdapter from 'axios-mock-adapter';
import request from './secureRequest';
import { getAuth } from '../config/auth';

const mock = new MockAdapter(request);

jest.mock('../config/auth');
const getCurrentSession = jest.fn();
const renewSession = jest.fn();
getAuth.mockImplementation(() => ({
  getCurrentSession,
  renewSession,
}));

describe('secureRequest', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('adds authorization and content-type headers', () => {
    const identity = {
      name: 'user1',
    };
    const headerIdentity = {
      userName: 'user1',
    };
    getCurrentSession
      .mockReturnValue(
        {
          access_token: 'expectedAccessToken',
          identity: JSON.stringify(identity),
        },
      );

    mock.onPost('http://localhost:8000/api')
      .reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/json;charset=utf-8');
        expect(requestConfig.headers.Authorization).toBe('Bearer expectedAccessToken');
        expect(requestConfig.headers.Identity).toBe(JSON.stringify(headerIdentity));
        return [200, { data: 'value' }];
      });

    return request.post('http://localhost:8000/api', { query: 'queryString' });
  });

  it('intercepts a 401 unauthorized response and reissues request with new token', () => {
    getCurrentSession
      .mockReturnValueOnce({ access_token: 'expiredAccessToken' })
      .mockReturnValueOnce({ access_token: 'renewedAccessToken' });

    renewSession
      .mockReturnValue(Promise.resolve());

    mock.onPost('http://localhost:8000/api')
      .replyOnce((requestConfig) => {
        expect(requestConfig.headers.Authorization).toBe('Bearer expiredAccessToken');
        return [401];
      });

    mock.onPost('http://localhost:8000/api')
      .replyOnce((requestConfig) => {
        expect(requestConfig.headers.Authorization).toBe('Bearer renewedAccessToken');
        return [200, { data: 'value' }];
      });

    return request.post('http://localhost:8000/api', { query: 'queryString' });
  });
});
