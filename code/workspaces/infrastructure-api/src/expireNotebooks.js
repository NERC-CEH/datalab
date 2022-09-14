import featureFlagsConfig from 'common/src/config/featureFlags';
import logger from './config/logger';
import database from './config/database';
import stackManager from './stacks/stackManager';
import stacksRepository from './dataaccess/stacksRepository';

const notebookExpiryLimitInDays = featureFlagsConfig().expireUnusedNotebooks.accessTimeLimit;

async function main() {
  await connectToDatabase();
  const notebooks = (await stacksRepository.getAllStacks())
    .filter(notebook => notebook.category === 'ANALYSIS')
    .filter(notebook => 'accessTime' in notebook)
    .filter(notebook => notebook.accessTime !== '');

  const unresolvedPromises = notebooks.map(suspendNotebookIfExpired);
  await Promise.all(unresolvedPromises);
  return process.exit(0);
}

async function suspendNotebookIfExpired(notebook) {
  const { projectKey, name, type, accessTime } = notebook;
  const timeDiff = new Date().getTime() - accessTime;
  const timeDiffInDays = Math.ceil((timeDiff) / (1000 * 60 * 60 * 24));

  if (timeDiffInDays > notebookExpiryLimitInDays) {
    logger.info(`Suspending notebook ${name} (not accessed for ${timeDiffInDays} days).`);
    try {
      await stackManager.scaleDownStack({ projectKey, name, type });
      await stacksRepository.resetAccessTime(projectKey, name);
    } catch (error) {
      logger.error(error);
    }
  }
}

async function connectToDatabase() {
  try {
    await database.createConnection();
  } catch (error) {
    throw new Error(`Error connecting to the database -> ${error}`);
  }
}

main().catch((error) => {
  logger.error(`Error with expiry job -> ${error.message}`);
  process.exit(1);
});

