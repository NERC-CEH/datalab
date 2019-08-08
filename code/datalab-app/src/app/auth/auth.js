import moment from 'moment';
import Promise from 'bluebird';
import auth0 from 'auth0-js';
import { pick } from 'lodash';
import cookies from './cookies';
import { setSession, clearSession, getSession } from '../core/sessionUtil';
import loginScreens from './auth0UniversalLoginScreens';

class Auth {
  constructor(authZeroInit, promisifyAuthZeroInit, authConfig) {
    this.authConfig = authConfig;
    this.authZeroAsync = promisifyAuthZeroInit;
    this.authZeroInit = authZeroInit;
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.expiresIn = this.expiresIn.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getCurrentSession = this.getCurrentSession.bind(this);
  }

  login() {
    // User redirected to Auth0 login page
    const state = JSON.stringify({ appRedirect: window.location.pathname });
    this.authZeroInit.authorize({ state });
  }

  signUp() {
    // Auth0 universal login configured to open on Sign Up page
    // Note: This required customization of Auth0 Universal Login widget (see auth0)
    const state = JSON.stringify({ appRedirect: window.location.pathname });
    this.authZeroInit.authorize({ state, initial_screen: loginScreens.SIGN_UP });
  }

  logout() {
    // User redirected to home page on logout
    clearSession();
    cookies.clearAccessToken();
    this.authZeroInit.logout({ returnTo: this.authConfig.returnTo });
  }

  handleAuthentication() {
    return this.authZeroAsync.parseHashAsync()
      .then(processHash);
  }

  renewSession() {
    const renewalAuthConfig = {
      ...pick(this.authConfig, ['audience', 'scope']),
      redirectUri: `${this.authConfig.returnTo}silent-callback`,
      usePostMessage: true,
    };
    // Attempt to renew token in an iframe
    return this.authZeroAsync.renewAuthAsync(renewalAuthConfig)
      .then(processHash)
      .catch(() => this.login()); // force login if renewAuth throws (user session expired)
  }

  expiresIn(expiresAt) {
    const expiresAtMoment = moment(expiresAt, 'x');
    if (!expiresAtMoment.isValid()) {
      throw new Error('Auth token expiresAt value is invalid.');
    }
    return expiresAtMoment.diff(moment.utc());
  }

  isAuthenticated(session) {
    if (session && session.expiresAt) {
      return this.expiresIn(session.expiresAt) > 0;
    }
    return false;
  }

  getCurrentSession() {
    const currentSession = getSession();
    return currentSession && processResponse(currentSession);
  }
}

function processHash(authResponse) {
  if (authResponse && authResponse.accessToken && authResponse.idToken) {
    const unpackedResponse = processResponse(authResponse);
    cookies.storeAccessToken(unpackedResponse);
    setSession(unpackedResponse);
    return unpackedResponse;
  }
  return null;
}

function processResponse(authResponse) {
  const state = processState(authResponse.state);
  const appRedirect = state ? state.appRedirect : undefined;
  const expiresAt = authResponse.expiresAt || expiresAtCalculator(authResponse.expiresIn);
  const identity = authResponse.identity || processIdentity(authResponse.idTokenPayload);

  return {
    ...authResponse,
    appRedirect,
    expiresAt,
    state,
    identity,
  };
}

function processState(state) {
  // auth0 silent renewal uses state parameter for a nonce value
  if (/appRedirect/.test(state)) {
    return JSON.parse(state);
  }
  return undefined;
}

function expiresAtCalculator(expiresIn) {
  return moment.utc().add(expiresIn, 's').format('x');
}

function processIdentity(idTokenPayload) {
  const knownFields = ['sub', 'name', 'nickname', 'picture'];

  return JSON.stringify(pick(idTokenPayload, knownFields));
}

let authSession;

const initialiseAuth = (authConfig) => {
  if (!authSession) {
    const AuthZero = new auth0.WebAuth(authConfig);
    const PromisifyAuthZero = Promise.promisifyAll(AuthZero);

    authSession = new Auth(AuthZero, PromisifyAuthZero, authConfig);
  }
};

const getAuth = () => (authSession);

export default getAuth;
export { initialiseAuth, Auth as PureAuth };
