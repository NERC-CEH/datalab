import auth0 from 'auth0-js';
import moment from 'moment';
import authConfig from './authConfig';
import { setSession, clearSession } from '../core/sessionUtil';

const authZeroInit = new auth0.WebAuth(authConfig);

export function login() {
  const state = JSON.stringify({ appRedirect: window.location.pathname });
  authZeroInit.authorize({ state });
}

export function logout() {
  // User redirected to home page on logout
  clearSession();
  authZeroInit.logout();
}

export function handleAuthentication() {
  return new Promise((resolve, reject) => authZeroInit.parseHash((err, authResponse) => {
    if (authResponse && authResponse.accessToken && authResponse.idToken) {
      const unpackedResponse = processResponse(authResponse);
      setSession(unpackedResponse);
      resolve(unpackedResponse);
    } else if (err) {
      reject(err);
    }
  }));
}

export function isAuthenticated(expiresAt) {
  const expiresAtMoment = moment(expiresAt, 'x');
  if (!expiresAtMoment.isValid()) {
    throw new Error('Auth token expiresAt value is invalid.');
  }
  return moment.utc().isBefore(moment(expiresAt, 'x'));
}

function processResponse(authResponse) {
  const unpackedState = JSON.parse(authResponse.state);
  return {
    ...authResponse,
    appRedirect: unpackedState.appRedirect,
    expiresAt: expiresAtCalculator(authResponse.expiresIn),
    state: unpackedState,
  };
}

function expiresAtCalculator(expiresIn) {
  return moment.utc().add(expiresIn, 's').format('x');
}
