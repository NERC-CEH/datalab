import status from '../controllers/status';
import notebook from '../controllers/notebookController';
import proxy from '../controllers/proxyController';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.post('/notebooks', notebook.createNotebookValidator, notebook.createNotebook);
  app.post('/routes', proxy.createProxyRouteValidator, proxy.createRoute);
  app.delete('/routes', proxy.deleteProxyRouteValidator, proxy.deleteRoute);
}

export default { configureRoutes };
