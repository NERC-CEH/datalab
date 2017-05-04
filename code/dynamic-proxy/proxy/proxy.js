import redbird from 'redbird';
import startEtcdBackend from './etcd-backend';
import config from '../config';

const proxy = redbird({
  port: config.get('proxyPort')
});

function startProxy() {
  //Initialise proxy with ETCD Backend
  startEtcdBackend(proxy);
}

export default startProxy;
