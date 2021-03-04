import requestConfig from './requestConfig';

describe('requestConfig', () => {
  it('returns correct headers', () => {
    expect(requestConfig('token')).toEqual({ headers: { authorization: 'token' } });
  });
});
