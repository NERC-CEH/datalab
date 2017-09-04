import logger from 'winston';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import notebookManager from '../notebooks/notebookManager';

function createNotebook(req, res) {
  // Parse request for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Invalid notebook creation request: ${req.body}`);
    return res.status(400).json({ errors: errors.mapped() });
  }

  // Build request params
  const { datalabName, notebookId, notebookType } = matchedData(req);

  // Handle request
  return notebookManager.createNotebook(datalabName, notebookId, notebookType)
    .then(() => {
      res.status(201);
      res.send({ message: 'OK' });
    })
    .catch((error) => {
      logger.error(error);
      res.status(500);
      res.send({ error });
    });
}

const createNotebookValidator = [
  check('datalabName').exists().withMessage('datalabName must be specified'),
  check('notebookId').exists().withMessage('notebookId must be specified'),
  check('notebookType').exists().withMessage('notebookType must be specified'),
];

export default { createNotebookValidator, createNotebook };
