import moment from 'moment';
import { PureAuth } from './auth';
import { setSession, clearSession, getSession } from '../core/sessionUtil';

jest.mock('../core/sessionUtil');

const authorizeMock = jest.fn();
const logoutMock = jest.fn();

const authConfig = {
  domain: 'expected.auth0.com',
  clientID: 'expected-client-id',
  audience: 'https://datalab.datalabs.nerc.ac.uk/api',
  responseType: 'token id_token',
  scope: 'openid profile',
  redirectUri: `${window.location.origin}/callback`,
  returnTo: `${window.location.origin}/`,
};

const MockAuthZero = {
  authorize: authorizeMock,
  logout: logoutMock,
  parseHashAsync: () => Promise.resolve(window.location.hash),
};

const auth = new PureAuth(MockAuthZero, MockAuthZero, authConfig);

describe('auth', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Work around for mutating window within the jest framework.
    // https://github.com/facebook/jest/issues/5124
    const location = {
      ...window.location,
      pathname: 'expectedPathname',
      hash: {
        accessToken: 'expectedAccessToken',
        expiresIn: '36000',
        idToken: 'expectedIdToken',
        state: JSON.stringify({ appRedirect: 'expectedState' }),
      },
    };

    delete window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
      configurable: true,
    });
  });

  it('login calls authorize with correct props', () => {
    // Act
    auth.login();

    // Assert
    expect(authorizeMock.mock.calls.length).toBe(1);
    expect(authorizeMock).toBeCalledWith({ state: '{"appRedirect":"expectedPathname"}' });
  });

  it('logout calls clearSession and auth0 logout', () => {
    // Act
    auth.logout();

    // Assert
    expect(logoutMock.mock.calls.length).toBe(1);
    expect(clearSession.mock.calls.length).toBe(1);
  });

  it('logout calls auth0 logout with returnTo url', () => {
    // Act
    auth.logout();

    // Assert
    expect(logoutMock).toBeCalledWith({ returnTo: 'http://localhost/' });
  });

  it('handleAuthentication processes response when hash has expected elements', () => auth.handleAuthentication().then((response) => {
    expect(response.accessToken).toBe('expectedAccessToken');
    expect(response.idToken).toBe('expectedIdToken');
    expect(response.appRedirect).toBe('expectedState');
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
    const userObject = { accessToken: 'accessToken', idToken: 'idToken' };

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
      accessToken: 'expectedAccessToken',
      expiresAt: 'expectedExpiresAt',
      idToken: 'expectedIdToken',
      identity: 'expectedIdentity',
    });

    // Act
    const output = getSession();

    // Assert
    expect(output.accessToken).toBe('expectedAccessToken');
    expect(output.expiresAt).toBe('expectedExpiresAt');
    expect(output.idToken).toBe('expectedIdToken');
    expect(output.identity).toBe('expectedIdentity');
  });
});
