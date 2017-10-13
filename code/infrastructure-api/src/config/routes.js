import status from '../controllers/status';
import stack from '../controllers/stackController';
import proxy from '../controllers/proxyController';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.post('/stacks', stack.createStackValidator, stack.createStack);
  app.delete('/stacks', stack.coreStackValidator, stack.deleteStack);
  app.post('/routes', proxy.createProxyRouteValidator, proxy.createRoute);
  app.delete('/routes', proxy.deleteProxyRouteValidator, proxy.deleteRoute);
}

export default { configureRoutes };
