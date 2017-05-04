import etcdService from '../services/etcd.service.js';

function listRoutes(req, res, next) {
  etcdService.getRoutes()
    .then((routes) => res.send(routes))
    .catch((error) => {
      res.status(500);
      res.send({ message: `Error loading routes`});
    });
}

function addRoute(req, res, next) {
  etcdService.addRoute(req.body.source, req.body.target)
    .then((response) => {
      res.status(201);
      res.send(response);
    })
    .catch((error) => {
      res.status(500);
      res.send({ message: `Error adding a route: ${error}`});
    });
}

function deleteRoute(req, res, next) {
  etcdService.deleteRoute(req.body.source)
    .then((response) => res.send(response))
    .catch((error) => {
      res.status(500);
      res.send({ message: `Error deleting route ${req.body.source}: ${error}`});
    });
}

function deleteAllRoutes(req, res, next) {
  etcdService.deleteAllRoutes()
    .then((response) => res.send(response))
    .catch((error) => {
      res.status(500);
      res.send({ message: `Error delecting all routes: ${error}`})
    });
}

export { listRoutes, addRoute, deleteRoute, deleteAllRoutes };
