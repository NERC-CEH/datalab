import logger from './config/logger';
import startKubeWatcher from './kubeWatcher/kubeWatcher';
import stackStatusChecker from './kubeWatcher/stackStatusChecker';
import config from './config/config';
import database from './config/database';

async function main() {
  setInterval(stackStatusChecker, config.get('statusCheckInterval'));
  await connectToDatabase();
  startKubeWatcher();
}

async function connectToDatabase() {
  try {
    await database.createConnection();
  } catch (error) {
    throw new Error(`Error connecting to the database -> ${error}`);
  }
}

main().catch((error) => {
  logger.error(`Error starting watcher -> ${error.message}`);
  process.exit(1);
});
