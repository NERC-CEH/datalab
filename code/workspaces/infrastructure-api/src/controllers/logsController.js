import { service } from 'service-chassis';
import { check, matchedData } from 'express-validator';
import logsApi from '../kubernetes/logsApi';
import logger from '../config/logger';
import podsApi from '../kubernetes/podsApi';
import stackRepository from '../dataaccess/stacksRepository';

// Logs are only exposed for sites initially, not notebooks
const CATEGORY = 'publish';

async function getByName(request, response) {
  const { user } = request;
  const { projectKey, name } = matchedData(request);

  return stackRepository.getOneByNameUserAndCategory(projectKey, user, name, CATEGORY)
    .then(stack => podsApi.getPodName(`${stack[0].type}-${stack[0].name}`, stack[0].projectKey))
    .then(podName => logsApi.readNamespacedPodLog(projectKey, podName))
    .then(logs => response.send(logs))
    .catch((err) => {
      logger.error(`Error retrieving logs for ${name}: ${JSON.stringify(err)}`);
      response.status(404).send();
    });
}

const existsCheck = fieldName => check(fieldName)
  .exists()
  .withMessage(`${fieldName} must be specified`)
  .trim()
  .isLength({ min: 1 })
  .withMessage(`${fieldName} must have content`);

const projectKeyCheck = existsCheck('projectKey');

const getByNameValidator = service.middleware.validator([
  projectKeyCheck,
  check('name')
    .exists(),
], logger);

export default {
  getByNameValidator,
  getByName,
};
