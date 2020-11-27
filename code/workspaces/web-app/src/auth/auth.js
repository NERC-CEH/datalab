import moment from 'moment';
import Promise from 'bluebird';
import Oidc from 'oidc-client';
import cookies from './cookies';
import { setSession, clearSession, getSession } from '../core/sessionUtil';

class Auth {
  constructor(oidcInit, promisifyOidcInit, authConfig) {
    this.authConfig = authConfig;
    this.oidcAsync = promisifyOidcInit;
    this.oidcInit = oidcInit;
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
    // Re-direct to login screen
    this.oidcInit.signinRedirect({ state: { appRedirect: window.location.pathname } });
  }

  signUp() {
    // Re-direct to login screen
    this.oidcInit.signinRedirect();
  }

  logout() {
    // User redirected to home page on logout
    clearSession();
    cookies.clearAccessToken();
    this.oidcInit.signoutRedirect();
  }

  handleAuthentication() {
    return this.oidcInit.signinRedirectCallback()
      .then(user => processHash(user));
  }

  renewSession() {
    // Library handles auto-renewal hence need to login to re-validate session
    return this.login();
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
  if (authResponse && authResponse.access_token && authResponse.id_token) {
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
  const expiresAt = authResponse.expires_at || expiresAtCalculator(authResponse.expires_in);
  const identity = authResponse.identity || processIdentity(authResponse.profile);

  return {
    ...authResponse,
    appRedirect,
    expiresAt,
    identity,
  };
}

function processState(state) {
  if (/appRedirect/.test(JSON.stringify(state))) {
    return state;
  }
  return undefined;
}

function expiresAtCalculator(expiresIn) {
  return moment.utc().add(expiresIn, 's').format('x');
}

function processIdentity({ sub, name, nickname, picture, email }) {
  const identityObject = {
    sub,
    name: email || name,
    nickname,
    picture,
  };
  return JSON.stringify(identityObject);
}

let authSession;

const initialiseAuth = (authConfig) => {
  if (!authSession) {
    Oidc.Log.logger = console;
    Oidc.Log.level = Oidc.Log.INFO;

    const userManagerConfig = {
      ...authConfig,
      userStore: new Oidc.WebStorageStateStore(),
    };

    const userManager = new Oidc.UserManager(userManagerConfig);
    const PromisifyUserManager = Promise.promisifyAll(userManager);

    authSession = new Auth(userManager, PromisifyUserManager, authConfig);
  }
};

const getAuth = () => (authSession);

export default getAuth;
export { initialiseAuth, Auth as PureAuth };
