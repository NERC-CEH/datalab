import Cookies from 'universal-cookie';

const ZEPPELIN_COOKIE_KEY = 'JSESSIONID';

function openNotebook(notebookUrl, cookie) {
  const notebookDomain = new URL(notebookUrl).hostname;
  const cookies = new Cookies();

  cookies.set(ZEPPELIN_COOKIE_KEY, cookie, { path: '/', domain: notebookDomain });
  window.open(notebookUrl);
}

export default { openNotebook };
