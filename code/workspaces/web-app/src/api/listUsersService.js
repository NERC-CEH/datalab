import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function listUsers() {
  const query = `
  Users {
      users { name userId verified }
  }`;

  return gqlQuery(query)
    .then(errorHandler('data.users'));
}

const listUsersService = { listUsers };
export default listUsersService;
