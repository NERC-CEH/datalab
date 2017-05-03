import redbird from 'redbird';
import { EtcdBackend } from './etcd-backend';

const proxy = redbird({
  port:8080
});

const options = {
  hosts: 'localhost',
  port: 2379,
  path: 'redbird'
}

//Initialise proxy with ETCD Backend
new EtcdBackend(proxy, options);
