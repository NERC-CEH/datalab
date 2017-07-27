import express from 'express';
import path from 'path';
import logger from 'winston';
import { URL } from 'url';

function configureConnectEndpoint(actions, port) {
  const app = express();

  app.set('view engine', 'pug');
  app.set('views', './src/api/views');
  app.use('/public', express.static(path.join(__dirname, '/public')));

  app.get('/', renderConnectPage(actions));

  app.listen(port, () => logger.info(`App listening on port ${port}.`));
}

const renderConnectPage = actions => (req, res) => {
  const requestOrigin = getConnectOrigin(req.headers);
  const actionsString = `['${actions.join('\',\'')}']`;
  res.render('connect', { origin: requestOrigin, actions: actionsString });
};

function getConnectOrigin(headers) {
  if (headers.referer) {
    return new URL(headers.referer).host;
  }
  return 'localhost';
}

export default { configureConnectEndpoint };
