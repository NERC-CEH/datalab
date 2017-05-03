import Etcd from 'node-etcd'
import Promise from 'bluebird'

export class EtcdBackend {
  constructor(proxy, options) {
    this.proxy = proxy;
    this.log = this.proxy.log;
    this.connection = Promise.promisifyAll(new Etcd(options.hosts, options.port, options.ssloptions));
    this.etcdDir = options.path ? options.path : "redbird";

    this.loadExistingConfiguration()
      .then(this.createWatcher());
  }

  loadExistingConfiguration() {
    let etcdDirExists = false;
    return this.connection.getAsync(this.etcdDir)
      .then((response) => {
        etcdDirExists = true;
        this.log.info(`Skipping ETCD directory creation as ${this.etcdDir} already exists`);
        if (response.node.nodes) {
          this.registerRoutes(response.node.nodes)
        }
      })
      .catch((error) => {
        if (!etcdDirExists) {
          this.log.info(`Creating ETCD directory ${this.etcdDir}`);
          return this.connection.mkdirAsync(this.etcdDir);
        }
        this.log.error(error);
      });
  }

  createWatcher() {
    // Watch etcd directory
    const watcher = this.connection.watcher(this.etcdDir, null, {recursive:true});

    // On Add/Update
    watcher.on("change", (body) => this.registerRoute(body.node));

    // On Delete
    watcher.on("delete", (body) => this.unregisterRoute(body.node));

    // Handle Errors
    watcher.on("error", (err) => this.log.error(err, 'etcd backend error'));
  }

  registerRoutes(routes) {
    routes.map((route) => this.registerRoute(route));
  }

  registerRoute(route) {
    if(route.key && route.value){
      this.proxy.register(this.cleanEtcdDir(route.key), route.value);
    }
  }

  unregisterRoute(route) {
    if(route.key){
      this.proxy.unregister(this.cleanEtcdDir(route.key));
    }
  }

  cleanEtcdDir(str) {
    let dirWithoutKey = str.replace(this.etcdDir, '').replace(/^\/+|\/+$/g, '');
    let decodedDir = decodeURIComponent(dirWithoutKey);
    return decodedDir
  }
}

