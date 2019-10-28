import authSelectors from './authSelectors';

const state = {
  authentication: {
    identity: {
      sub: 'auth0|0000',
      name: 'first.last@organsiation.ac.uk',
      nickname: 'first.last',
      picture: 'url/to/picture',
    },
    permissions: {
      fetching: false,
      error: null,
      value: ['permissions'],
    },
    tokens: {
      accessToken: 'accessToken',
      expiresAt: '0000',
      idToken: 'idToken',
    },
  },
};

describe('currentUserId', () => {
  it('returns user id from state', () => {
    expectNotUndefinedAndEqualTo(
      authSelectors.currentUserId(state),
      state.authentication.identity.sub,
    );
  });
});

describe('currentUserPermissions', () => {
  it('returns permissions object from state', () => {
    expectNotUndefinedAndEqualTo(
      authSelectors.currentUserPermissions(state),
      state.authentication.permissions,
    );
  });
});

describe('currentUserTokens', () => {
  it('returns tokens from state', () => {
    expectNotUndefinedAndEqualTo(
      authSelectors.currentUserTokens(state),
      state.authentication.tokens,
    );
  });
});

const expectNotUndefinedAndEqualTo = (actual, expected) => {
  expect(actual).not.toBeUndefined();
  expect(actual).toEqual(expected);
};
