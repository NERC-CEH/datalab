import Cookies from 'universal-cookie';

const ZEPPELIN_COOKIE_KEY = 'JSESSIONID';

function openNotebook(notebookUrl, cookie) {
  console.log(`Notebook URL ${notebookUrl}`);
  const notebookDomain = new URL(notebookUrl).hostname;
  const notebookBaseDomain = notebookDomain.substring(notebookDomain.indexOf('.'), notebookDomain.length);
  const cookies = new Cookies();

  console.log(`Removing cookie: ${ZEPPELIN_COOKIE_KEY} from domain ${notebookDomain}`);
  cookies.remove(ZEPPELIN_COOKIE_KEY, { domain: notebookDomain });

  console.log(`Saving cookie: ${cookie} to domain ${notebookBaseDomain}`);
  cookies.set(ZEPPELIN_COOKIE_KEY, cookie, { path: '/', domain: notebookBaseDomain });
  window.open(notebookUrl);
}

export default { openNotebook };
