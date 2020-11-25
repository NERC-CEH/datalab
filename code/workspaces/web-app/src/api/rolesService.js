import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

async function getAllUsersAndRoles() {
  const query = `
    GetAllUsersAndRoles {
      allUsersAndRoles {
        userId,
        name,
        instanceAdmin,
        projectRoles {
          projectKey,
          role
        }
      }
    }`;

  const allUsersAndRoles = await gqlQuery(query)
    .then(errorHandler('data.allUsersAndRoles'));
  return allUsersAndRoles;
}

export default { getAllUsersAndRoles };
