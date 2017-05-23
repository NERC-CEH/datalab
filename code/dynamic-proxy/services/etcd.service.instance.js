import Etcd from 'node-etcd';
import Promise from 'bluebird';
import Service from './etcd.service';
import config from '../config';

const etcdHost = config.get('etcdHost');
const etcdPort = config.get('etcdPort');

const connection = Promise.promisifyAll(new Etcd(`${etcdHost}:${etcdPort}`));

export default new Service(connection);
