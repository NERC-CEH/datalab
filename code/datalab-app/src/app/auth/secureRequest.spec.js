import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import request from './secureRequest';
import auth from './auth';

const mock = new MockAdapter(request);

jest.mock('./auth');
const getCurrentSession = jest.fn();
const renewSession = jest.fn();
auth.mockImplementation(() => ({
  getCurrentSession,
  renewSession,
}));

describe('secureRequest', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('adds authorization and content-type headers', () => {
    getCurrentSession
      .mockReturnValue({ accessToken: 'expectedAccessToken' });

    mock.onPost('http://localhost:8000/api')
      .reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/json;charset=utf-8');
        expect(requestConfig.headers.Authorization).toBe('Bearer expectedAccessToken');
        return [200, { data: 'value' }];
      });

    return request.post('http://localhost:8000/api', { query: 'queryString' });
  });

  it('intercepts a 401 unathorized response and reissues request with new token', () => {
    getCurrentSession
      .mockReturnValueOnce({ accessToken: 'expiredAccessToken' })
      .mockReturnValueOnce({ accessToken: 'renewedAccessToken' });

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
