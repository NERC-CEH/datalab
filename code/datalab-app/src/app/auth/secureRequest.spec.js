import moxios from 'moxios';
import request from './secureRequest';
import auth from './auth';

jest.mock('./auth');

describe('secureRequest', () => {
  beforeEach(() => moxios.install());

  afterEach(() => moxios.uninstall());

  it('adds authorization and content-type headers', () => {
    auth.getCurrentSession = jest.fn()
      .mockReturnValue({ accessToken: 'expectedAccessToken' });

    moxios.stubRequest(
      'http://localhost:8000/api',
      {
        status: 200,
        response: { data: 'value' },
      });

    const mockProcessResponse = jest.fn();
    return request.post(
      'http://localhost:8000/api',
      {
        query: 'queryString',
      })
      .then(mockProcessResponse)
      .then(() => {
        const res = moxios.requests.first();
        expect(res.headers['Content-Type']).toBe('application/json;charset=utf-8');
        expect(res.headers.Authorization).toBe('Bearer expectedAccessToken');
      });
  });

  it('intercepts a 401 unathorized response and reissues request with new token', () => {
    auth.getCurrentSession = jest.fn()
      .mockReturnValue({ accessToken: 'expiredAccessToken' })
      .mockReturnValue({ accessToken: 'renewedAccessToken' });

    moxios.stubRequest(
      'http://localhost:8000/api',
      {
        status: 401, // For both responses
      });

    const mockProcessResponse = jest.fn();
    return request.post(
      'http://localhost:8000/api',
      {
        query: 'queryString',
      })
      .then(mockProcessResponse)
      .catch(() => {
        // moxios only seems to capture the final axios request even though two were issued
        const res = moxios.requests.mostRecent();
        expect(res.headers['Content-Type']).toBe('application/json;charset=utf-8');
        expect(res.headers.Authorization).toBe('Bearer renewedAccessToken');
      });
  });
});
