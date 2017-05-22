import redbird from 'redbird';
import startEtcdBackend from './etcd-backend';
import config from '../config';

const proxy = redbird({
  port: config.get('proxyPort'),
  ssl: {
    port: 8443,
    key: config.get('ssl.key'),
    cert: config.get('ssl.cert'),
  },
});

function startProxy() {
  // Initialise proxy with ETCD Backend
  startEtcdBackend(proxy);
}

export default startProxy;
