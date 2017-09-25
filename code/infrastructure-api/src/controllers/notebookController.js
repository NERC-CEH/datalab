import { check } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import controllerHelper from './controllerHelper';
import notebookManager from '../notebooks/notebookManager';

const TYPE = 'notebook';

function createNotebook(request, response) {
  const errorMessage = 'Invalid notebook creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createNotebookExec);
}

function deleteNotebook(request, response) {
  const errorMessage = 'Invalid notebook deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteNotebookExec);
}

function createNotebookExec(request, response) {
  // Build request params
  const { datalabInfo, notebookId, notebookType } = matchedData(request);

  // Handle request
  return notebookManager.createNotebook(datalabInfo, notebookId, notebookType)
    .then(controllerHelper.sendSuccessfulCreation(response))
    .catch(controllerHelper.handleError(response, 'creating', TYPE, notebookId));
}

function deleteNotebookExec(request, response) {
  // Build request params
  const { datalabInfo, notebookId, notebookType } = matchedData(request);

  // Handle request
  return notebookManager.deleteNotebook(datalabInfo, notebookId, notebookType)
    .then(controllerHelper.sendSuccessfulDeletion(response))
    .catch(controllerHelper.handleError(response, 'deleting', TYPE, notebookId));
}

const createNotebookValidator = [
  check('datalabInfo.name').exists().withMessage('datalabInfo.name must be specified'),
  check('datalabInfo.domain').exists().withMessage('datalabInfo.domain must be specified'),
  check('datalabInfo.volume').exists().withMessage('datalabInfo.volume must be specified'),
  check('notebookId').exists().withMessage('notebookId must be specified'),
  check('notebookType').exists().withMessage('notebookType must be specified'),
];

export default { createNotebookValidator, createNotebook, deleteNotebook };
