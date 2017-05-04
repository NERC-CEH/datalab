import redbird from 'redbird';
import { EtcdBackend } from './etcd-backend';
import config from './config';

const proxy = redbird({
  port: config.get('proxyPort')
});

export default function startProxy() {
  //Initialise proxy with ETCD Backend
  new EtcdBackend(proxy);
}
