import auth0 from 'auth0-js';
import authConfig from './authConfig';

const localStorageFields = {
  access_token: 'accessToken',
  expires_at: 'expiresAt',
  id_token: 'idToken',
};

const authZeroInit = new auth0.WebAuth(authConfig);

export function login() {
  const state = JSON.stringify({ appRedirect: window.location.pathname });
  authZeroInit.authorize({ state });
}

export function logout() {
  return new Promise(resolve => resolve(clearSession()));
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

export function isAuthenticated(user) {
  return user && user.expiresAt && new Date().getTime() < user.expiresAt;
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
  return JSON.stringify((expiresIn * 1000) + new Date().getTime());
}

function setSession(authResponse) {
  Object.entries(localStorageFields)
    .map(([key, value]) => localStorage.setItem(key, authResponse[value]));
}

function clearSession() {
  Object.keys(localStorageFields)
    .map(key => localStorage.removeItem(key));
}
