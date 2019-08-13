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

export default getUserPermissions;
