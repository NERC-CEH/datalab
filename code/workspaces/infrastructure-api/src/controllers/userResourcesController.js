import { matchedData } from 'express-validator';
import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';

async function listUserResources(request, response, next) {
  const { userId } = matchedData(request);

  try {
    const storageAccessInfo = await dataStorageRepository.getAllActiveByUser(userId);
    const storageAccess = storageAccessInfo
      .map(store => ({ projectKey: store.projectKey, name: store.name }));

    const stacksOwned = await stacksRepository.getAllOwned({ sub: userId });
    const notebookOwner = stacksOwned
      .filter(stack => stack.category === ANALYSIS)
      .map(stack => ({ projectKey: stack.projectKey, name: stack.name }));
    const siteOwner = stacksOwned
      .filter(stack => stack.category === PUBLISH)
      .map(stack => ({ projectKey: stack.projectKey, name: stack.name }));

    response.send({
      storageAccess,
      notebookOwner,
      siteOwner,
    });
  } catch (error) {
    next(new Error(`Unable to list resources for user ${userId}: ${error.message}`));
  }
}

export default { listUserResources };
