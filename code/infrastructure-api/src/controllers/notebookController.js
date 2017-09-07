import logger from 'winston';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import notebookManager from '../notebooks/notebookManager';

function createNotebook(request, response) {
  // Parse request for errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error(`Invalid notebook creation request: ${JSON.stringify(request.body)}`);
    return response.status(400).json({ errors: errors.mapped() });
  }

  // Build request params
  const { datalabInfo, notebookId, notebookType } = matchedData(request);

  // Handle request
  return notebookManager.createNotebook(datalabInfo, notebookId, notebookType)
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
  check('datalabInfo.name').exists().withMessage('datalabInfo.name must be specified'),
  check('datalabInfo.domain').exists().withMessage('datalabInfo.domain must be specified'),
  check('datalabInfo.volume').exists().withMessage('datalabInfo.volume must be specified'),
  check('notebookId').exists().withMessage('notebookId must be specified'),
  check('notebookType').exists().withMessage('notebookType must be specified'),
];

export default { createNotebookValidator, createNotebook };
