import etcdService from './services/etcd.service.js';

export class EtcdBackend {
  constructor(proxy) {
    this.proxy = proxy;
    this.log = this.proxy.log;

    this.initialiseBackend();
  }

  initialiseBackend() {
    etcdService.getOrCreateDirectory()
      .then(this.registerRoutes)
      .then(this.createWatcher);
  }

  createWatcher() {
    // Watch etcd directory
    const watcher = etcdService.createWatcher();

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
    let decodedDir = dirWithoutKey.replace('-', '/');
    return decodedDir
  }
}

