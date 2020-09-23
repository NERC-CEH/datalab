import moment from 'moment';
import { PureAuth } from './auth';
import { setSession, clearSession, getSession } from '../core/sessionUtil';

jest.mock('../core/sessionUtil');

const signinRedirectMock = jest.fn();
const signinRedirectCallbackMock = jest.fn();
const signoutRedirectMock = jest.fn();

const authConfig = {
  authority: 'expected.auth0.com',
  client_id: 'expected-client-id',
  extraQueryParams: {
    audience: 'https://datalab.datalabs.nerc.ac.uk/api',
  },
  response_type: 'token id_token',
  scope: 'openid profile',
  redirect_uri: `${window.location.origin}/callback`,
};

const MockAuth = {
  signinRedirect: signinRedirectMock,
  signinRedirectCallback: signinRedirectCallbackMock,
  signoutRedirect: signoutRedirectMock,
  parseHashAsync: () => Promise.resolve(window.location.hash),
};

const auth = new PureAuth(MockAuth, MockAuth, authConfig);

describe('auth', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const location = {
      ...window.location,
      pathname: 'expectedPathname',
    };

    delete window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
      configurable: true,
    });

    signinRedirectCallbackMock.mockReturnValue(
      Promise.resolve({
        id_token: 'expectedIdToken',
        access_token: 'expectedAccessToken',
        identity: { sub: 'exampleUserId' },
        expiresAt: moment.utc().add(10, 'hours'),
      }),
    );
  });

  it('login calls signinRedirect with correct props', () => {
    // Act
    auth.login();

    // Assert
    expect(signinRedirectMock.mock.calls.length).toBe(1);
    expect(signinRedirectMock).toBeCalledWith({ appRedirect: 'expectedPathname' });
  });

  it('logout calls clearSession and signoutRedirect', () => {
    // Act
    auth.logout();

    // Assert
    expect(signoutRedirectMock.mock.calls.length).toBe(1);
    expect(clearSession.mock.calls.length).toBe(1);
  });

  it('handleAuthentication processes response when hash has expected elements', () => auth.handleAuthentication().then((response) => {
    expect(response.access_token).toBe('expectedAccessToken');
    expect(response.id_token).toBe('expectedIdToken');
  }));

  it('handleAuthentication calls setSession when hash has expected elements', () => auth.handleAuthentication().then((response) => {
    expect(setSession).toHaveBeenCalledWith(response);
  }));

  it('handleAuthentication sets correct expiresAt value', () => auth.handleAuthentication().then((response) => {
    const expiresAt = moment(response.expiresAt, 'x');
    expect(expiresAt.fromNow()).toBe('in 10 hours');
  }));

  it('isAuthenticated returns false for past date-time', () => {
    // Arrange
    const expiresAt = '1496271600000';

    // Act/Assert
    expect(auth.isAuthenticated({ expiresAt })).toBe(false);
  });

  it('isAuthenticated returns true for future date-time', () => {
    // Arrange
    const expiresAt = JSON.stringify(Date.now() + 30000);

    // Act/Assert
    expect(auth.isAuthenticated({ expiresAt })).toBe(true);
  });

  it('isAuthenticated throws false for "null" user', () => {
    // Act/Assert
    expect(auth.isAuthenticated(null)).toBe(false);
  });

  it('isAuthenticated throws false for user object without expiresAt', () => {
    // Arrange
    const userObject = { access_token: 'accessToken', id_token: 'idToken' };

    // Act/Assert
    expect(auth.isAuthenticated(userObject)).toBe(false);
  });

  it('isAuthenticated throws error for incorrectly formatted expiresAt', () => {
    // Arrange
    const expiresAt = 'not date';

    // Act/Assert
    expect(() => auth.isAuthenticated({ expiresAt }))
      .toThrow('Auth token expiresAt value is invalid.');
  });

  it('getCurrentSession calls getSession', () => {
    // Act
    auth.getCurrentSession();

    // Assert
    expect(getSession.mock.calls.length).toBe(1);
  });

  it('getCurrentSession returns undefined if no session available', () => {
    // Act/Assert
    expect(getSession()).toBe(undefined);
  });

  it('getCurrentSession if session found returns correctly formatted authResponse', () => {
    // Arrange
    getSession.mockReturnValue({
      access_token: 'expectedAccessToken',
      expiresAt: 'expectedExpiresAt',
      id_token: 'expectedIdToken',
      identity: 'expectedIdentity',
    });

    // Act
    const output = getSession();

    // Assert
    expect(output.access_token).toBe('expectedAccessToken');
    expect(output.expiresAt).toBe('expectedExpiresAt');
    expect(output.id_token).toBe('expectedIdToken');
    expect(output.identity).toBe('expectedIdentity');
  });
});
