import Etcd from 'node-etcd'
import Promise from 'bluebird'
import config from '../config';

const etcdHost = config.get('etcdHost');
const etcdPort = config.get('etcdPort');
const etcdRedbirdDir = config.get('redbirdEtcdKey');

export class EtcdService {
  constructor() {
    this.connection = Promise.promisifyAll(new Etcd(etcdHost, etcdPort));
  }

  getRoutes() {
    return this.connection.getAsync(etcdRedbirdDir)
      .then(response => response.node.nodes.map(({ key, value }) => ({ key, value })))
      .catch(error => []);
  }

  addRoute(source, target) {
    const path = this.createEtcdPath(source);
    console.log(path);
    return this.connection.setAsync(this.createEtcdPath(source), target)
      .then(response => response);
  }

  deleteRoute(source) {
    return this.connection.delAsync(this.createEtcdPath(source))
      .then(response => response);
  }

  deleteAllRoutes() {
    return this.connection.delAsync(`${etcdRedbirdDir}/`, { recursive: true })
      .then(() => this.connection.mkdirAsync(etcdRedbirdDir))
      .then(response => response);
  }

  createEtcdPath(source) {
    const encodedPath = source.replace('/', '-');
    return `${etcdRedbirdDir}/${encodedPath}`;
  }
}

export default new EtcdService();
