import authSelectors from './authSelectors';

const state = {
  authentication: {
    identity: {
      sub: 'expected value',
    },
  },
};

describe('currentUserId', () => {
  it('returns user id from state', () => {
    expect(authSelectors.currentUserId(state)).toBe('expected value');
  });
});
