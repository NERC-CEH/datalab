import moment from 'moment';
import Promise from 'bluebird';
import auth0 from 'auth0-js';
import authConfig from './authConfig';
import { setSession, clearSession, getSession } from '../core/sessionUtil';

class Auth {
  constructor(authZeroInit, promisifyAuthZeroInit) {
    this.authZeroInit = authZeroInit;
    this.authZeroAsync = promisifyAuthZeroInit;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getCurrentSession = this.getCurrentSession.bind(this);
  }

  login() {
    // User redirected to Auth0 login page
    const state = JSON.stringify({ appRedirect: window.location.pathname });
    this.authZeroInit.authorize({ state });
  }

  logout() {
    // User redirected to home page on logout
    clearSession();
    this.authZeroInit.logout();
  }

  handleAuthentication() {
    return this.authZeroAsync.parseHashAsync()
      .then((authResponse) => {
        if (authResponse && authResponse.accessToken && authResponse.idToken) {
          const unpackedResponse = processResponse(authResponse);
          setSession(unpackedResponse);
          return unpackedResponse;
        }
        return null;
      });
  }

  isAuthenticated(session) {
    if (session && session.expiresAt) {
      const expiresAtMoment = moment(session.expiresAt, 'x');
      if (!expiresAtMoment.isValid()) {
        throw new Error('Auth token expiresAt value is invalid.');
      }
      return moment.utc().isBefore(moment(session.expiresAt, 'x'));
    }
    return false;
  }

  getCurrentSession() {
    const currentSession = getSession();
    return currentSession && processResponse(currentSession);
  }
}

function processResponse(authResponse) {
  const state = authResponse.state ? JSON.parse(authResponse.state) : undefined;
  const appRedirect = state ? state.appRedirect : undefined;
  const expiresAt = authResponse.expiresAt ? authResponse.expiresAt : expiresAtCalculator(authResponse.expiresIn);

  return {
    ...authResponse,
    appRedirect,
    expiresAt,
    state,
  };
}

function expiresAtCalculator(expiresIn) {
  return moment.utc().add(expiresIn, 's').format('x');
}

const AuthZero = new auth0.WebAuth(authConfig);
const PromisifyAuthZero = Promise.promisifyAll(AuthZero);
export default new Auth(AuthZero, PromisifyAuthZero);
export { Auth as PureAuth }; // export for testing
