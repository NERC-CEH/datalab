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

async function getOtherUserRoles(userId) {
  const query = `
    GetOtherUserRoles($userId: String!) {
      otherUserRoles(userId: $userId) {
        instanceAdmin,
        projectAdmin,
        projectUser,
        projectViewer,
        siteOwner { projectKey, name},
        notebookOwner { projectKey, name},
        storageAccess { projectKey, name}
      }
    }`;

  const otherUserRoles = await gqlQuery(query, { userId })
    .then(errorHandler('data.otherUserRoles'));

  return {
    userId,
    otherUserRoles,
  };
}

export default { getUserPermissions, getOtherUserRoles };
