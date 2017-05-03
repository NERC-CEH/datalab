import redbird from 'redbird';
import { EtcdBackend } from './etcd-backend';
import config from './config';

const proxy = redbird({
  port: config.get('proxyPort')
});

const options = {
  hosts: config.get('etcdHost'),
  port: config.get('etcdPort'),
  path: config.get('redbirdEtcdKey')
}

export default function startProxy() {
  //Initialise proxy with ETCD Backend
  new EtcdBackend(proxy, options);
}
