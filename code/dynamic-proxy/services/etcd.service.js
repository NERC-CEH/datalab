import Etcd from 'node-etcd';
import Promise from 'bluebird';
import bunyan from 'bunyan';
import config from '../config';

const logger = bunyan.createLogger({ name: 'etcd.service' });

const etcdHost = config.get('etcdHost');
const etcdPort = config.get('etcdPort');
const etcdRedbirdDir = config.get('redbirdEtcdKey');

export class EtcdService {
  constructor() {
    this.connection = Promise.promisifyAll(new Etcd(`${etcdHost}:${etcdPort}`));
  }

  getRoutes() {
    return this.connection.getAsync(etcdRedbirdDir)
      .then(EtcdService.extractRoutes);
  }

  addRoute(source, target) {
    return this.connection.setAsync(EtcdService.createEtcdPath(source), target)
      .then(response => response);
  }

  deleteRoute(source) {
    return this.connection.delAsync(EtcdService.createEtcdPath(source))
      .then(response => response);
  }

  deleteAllRoutes() {
    logger.info('Deleting Redbird directory');
    return this.connection.delAsync(`/${etcdRedbirdDir}/`, { recursive: true })
      .then(() => this.createDirectory())
      .then(response => response);
  }

  getOrCreateDirectory() {
    let etcdDirExists = false;
    return this.connection.getAsync(etcdRedbirdDir)
      .then((response) => {
        etcdDirExists = true;
        logger.info('Redbird directory exists, loading routes');
        return this.extractRoutes(response);
      })
      .catch(() => {
        if (!etcdDirExists) {
          logger.info('Creating Redbird directory');
          return this.createDirectory()
            .then(() => []);
        }
        return [];
      });
  }

  createDirectory() {
    return this.connection.mkdirAsync(etcdRedbirdDir);
  }

  createWatcher() {
    return this.connection.watcher(etcdRedbirdDir, null, { recursive: true });
  }

  static extractRoutes(response) {
    if (response.node.nodes) {
      return response.node.nodes.map(({ key, value }) => ({ key, value }));
    }
    return [];
  }

  static createEtcdPath(source) {
    const encodedPath = source.replace('/', '-');
    return `${etcdRedbirdDir}/${encodedPath}`;
  }
}

export default new EtcdService();
