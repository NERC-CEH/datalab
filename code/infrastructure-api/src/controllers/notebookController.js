import logger from 'winston';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import notebookManager from '../notebooks/notebookManager';

function createNotebook(request, response) {
  // Parse request for errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error(`Invalid notebook creation request: ${request.body}`);
    return response.status(400).json({ errors: errors.mapped() });
  }

  // Build request params
  const { datalabName, notebookId, notebookType } = matchedData(request);

  // Handle request
  return notebookManager.createNotebook(datalabName, notebookId, notebookType)
    .then(() => {
      response.status(201);
      response.send({ message: 'OK' });
    })
    .catch(handleError(response, notebookId));
}

const handleError = (res, notebookId) => (error) => {
  logger.error(error);
  res.status(500);
  res.send({
    message: `Error creating notebook ${notebookId}`,
    error: error.message });
};

const createNotebookValidator = [
  check('datalabName').exists().withMessage('datalabName must be specified'),
  check('notebookId').exists().withMessage('notebookId must be specified'),
  check('notebookType').exists().withMessage('notebookType must be specified'),
];

export default { createNotebookValidator, createNotebook };
