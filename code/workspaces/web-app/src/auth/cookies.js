import moment from 'moment';
import Cookies from 'universal-cookie';
import { getDomainInfo } from '../core/getDomainInfo';

const cookies = new Cookies('');
const COOKIE_NAME = 'authorization';

function storeAccessToken({ access_token: accessToken, expiresAt }) {
  const domainInfo = getDomainInfo();
  // oidc-client requires coversion using moment.unix from auth0
  // this can/may differ depending on OIDC provider
  const options = { path: '/', expires: moment.unix(expiresAt).toDate(), domain: `.${domainInfo.domain}` };
  cookies.set(COOKIE_NAME, accessToken, options);
}

function clearAccessToken() {
  const domainInfo = getDomainInfo();
  const options = { path: '/', domain: `.${domainInfo.domain}` };
  cookies.remove(COOKIE_NAME, options);
}

const authCookies = { storeAccessToken, clearAccessToken };
export default authCookies;

