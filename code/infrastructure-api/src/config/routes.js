import status from '../controllers/status';
import stack from '../controllers/stackController';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.post('/stacks', stack.createStackValidator, stack.createStack);
  app.delete('/stacks', stack.coreStackValidator, stack.deleteStack);
}

export default { configureRoutes };
