import logger from './logger';
import updateUserRoles from './updateUserRoles';

updateUserRoles()
  .then(res => logger.info(res))
  .catch(err => logger.error(err.message));
