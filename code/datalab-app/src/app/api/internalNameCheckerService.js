import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function checkNameUniqueness(name) {
  const query = `
    CheckInternalName($name: String!) {
      checkNameUniqueness(name: $name)
    }`;

  return gqlQuery(query, { name })
    .then(errorHandler('data.checkNameUniqueness'));
}

export default {
  checkNameUniqueness,
};
