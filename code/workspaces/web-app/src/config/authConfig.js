import axios from 'axios';
import Oidc from 'oidc-client';
import Promise from 'bluebird';
import Auth from '../auth/auth';

let authSession;

async function getAuthConfig() {
  const { data } = await axios.get('/web_auth_config.json');

  // Overwrite default configuration for running locally/development purposes
  return window.location.hostname.match(/localhost/) ? localData(data) : data;
}

function localData(data) {
  const newData = data;
  newData.oidc.userManager.silent_redirect_uri = `${window.location.origin}/silent_callback`;
  newData.oidc.userManager.redirect_uri = `${window.location.origin}/callback`;
  return newData;
}

async function initialiseAuth() {
  const authConfig = await getAuthConfig();
  Oidc.Log.logger = console;
  Oidc.Log.level = Oidc.Log.INFO;

  const userManagerConfig = {
    ...authConfig.oidc.userManager,
    userStore: new Oidc.WebStorageStateStore(),
  };

  const userManager = new Oidc.UserManager(userManagerConfig);
  const PromisifyUserManager = Promise.promisifyAll(userManager);

  authSession = new Auth(userManager, PromisifyUserManager, authConfig);
}

const getAuth = () => (authSession);

export { initialiseAuth, getAuth };
