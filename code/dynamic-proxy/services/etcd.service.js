import Etcd from 'node-etcd'
import Promise from 'bluebird'

const etcdHost = 'localhost';
const etcdPort = 2379;
const etcdRedbirdDir = 'redbird';

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
    return this.connection.setAsync(source, target)
      .then(response => response);
  }

  deleteRoute(source) {
    return this.connection.delAsync(source)
      .then(response => response);
  }
}

export default new EtcdService();
