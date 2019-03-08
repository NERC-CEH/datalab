/**
 * Two cookies are expected from an RStudio login.
 * These need to be parsed and split into the three required values
 * - expires
 * - token
 * - csrfToken
 *
 * The form of the cookies is a string array
 * ['user-id=rstudio|Thu%2C%2002%20Nov%202017%2008%3A26%3A46%20GMT|cybwuAyQf1YcC9qnf4XqUX1sMMXTZRmP5tfZRjBTW6E%3D; path=/; HttpOnly',
 * 'csrf-token=a9a40335-dc8d-43ee-bc65-7f2e93e44a4a; path=/']
 * @param cookies
 */
/* eslint prefer-destructuring: 0 */
function parseCookies(cookies) {
  if (cookies && cookies.length >= 2) {
    return cookies.reduce((accumulator, cookie) => {
      // First split by ';' - first part is the cookie body
      const cookieBody = cookie.split(';')[0];

      const splitCookie = cookieBody.split('=');
      const cookieName = splitCookie[0];
      const cookieValue = splitCookie[1];

      if (cookieName === 'user-id') {
        const splitValue = cookieValue.split('|');
        accumulator.expires = splitValue[1]; // eslint-disable-line no-param-reassign
        accumulator.token = splitValue[2]; // eslint-disable-line no-param-reassign
      }

      if (cookieName === 'csrf-token') {
        accumulator.csrfToken = cookieValue; // eslint-disable-line no-param-reassign
      }

      return accumulator;
    }, {});
  }
  return {};
}

export default parseCookies;
