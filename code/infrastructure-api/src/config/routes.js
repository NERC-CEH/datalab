import status from '../controllers/status';
import notebook from '../controllers/notebookController';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.post('/notebooks', notebook.createNotebookValidator, notebook.createNotebook);
}

export default { configureRoutes };
