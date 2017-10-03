import axios from 'axios';
import querystring from 'querystring';
import logger from 'winston';
import rstudioCookieHandler from '../login/rstudioCookieHandler';
import encrypt from '../../vendor/encrypt.min';

const rstudioLogin = notebook => (credentials) => {
  if (!credentials.username || !credentials.password) {
    return Promise.reject(new Error('username or password not defined'));
  }

  return getRStudioCertificateUrl(notebook)
    .then(login(notebook, credentials));
};

const login = (notebook, credentials) => (response) => {
  const certificateParts = response.data.split(':');
  const userPayload = `${credentials.username}\n${credentials.password}`;
  const exp = certificateParts[0];
  const mod = certificateParts[1];
  const encrypted = encrypt.encrypt(userPayload, exp, mod);

  const payload = querystring.stringify({
    persist: '0',
    appUri: '',
    clientPath: '/auth-sign-in',
    v: encrypted,
  });

  const options = {
    maxRedirects: 0,
    // RStudio returns a 302 redirect for successful log in so we need to change
    // success validation for this request
    validateStatus: status => status >= 200 && status < 400,
  };

  return axios.post(getRStudioLoginUrl(notebook), payload, options)
    .then((loginResponse) => {
      const cookies = loginResponse.headers['set-cookie'];
      return rstudioCookieHandler(cookies);
    })
    .catch((error) => {
      throw new Error(`Unable to log in to RStudio: ${error.message}`);
    });
};

function getRStudioCertificateUrl(notebook) {
  return axios.get(`${notebook.internalEndpoint}/auth-public-key`)
    .catch((error) => {
      throw new Error(`Unable to retrieve RStudio certificate: ${error.message}`);
    });
}

function getRStudioLoginUrl(notebook) {
  const rstudioUrl = `${notebook.internalEndpoint}/auth-do-sign-in`;
  logger.info(`Request log in cookie from RStudio at: ${rstudioUrl}`);
  return rstudioUrl;
}

export default { rstudioLogin };
