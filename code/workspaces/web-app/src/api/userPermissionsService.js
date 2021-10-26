import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function getUserPermissions() {
  const query = `
    GetPermissions {
      userPermissions
    }`;

  return gqlQuery(query)
    .then(errorHandler('data.userPermissions'));
}

const userPermissionsService = { getUserPermissions };
export default userPermissionsService;
