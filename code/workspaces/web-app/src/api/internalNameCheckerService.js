import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function checkNameUniqueness(projectKey, name) {
  const query = `
    CheckInternalName($projectKey: String!, $name: String!) {
      checkNameUniqueness(projectKey: $projectKey, name: $name)
    }`;

  return gqlQuery(query, { projectKey, name })
    .then(errorHandler('data.checkNameUniqueness'));
}

const internalNameCheckerService = {
  checkNameUniqueness,
};
export default internalNameCheckerService;
