import { gqlQuery, gqlMutation } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

async function getAllUsersAndRoles() {
  const query = `
    GetAllUsersAndRoles {
      allUsersAndRoles { 
        userId,
        name,
        instanceAdmin,
        dataManager,
        catalogueRole,
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

async function setInstanceAdmin(userId, instanceAdmin) {
  const mutation = `
    SetInstanceAdmin($userId: ID!, $instanceAdmin: Boolean!) {
      setInstanceAdmin(userId: $userId, instanceAdmin: $instanceAdmin) {
        userId,
        instanceAdmin
      }
    }`;

  const newInstanceAdmin = await gqlMutation(mutation, { userId, instanceAdmin })
    .then(errorHandler('data.setInstanceAdmin'));
  return newInstanceAdmin;
}

async function setDataManager(userId, dataManager) {
  const mutation = `
    SetDataManager($userId: ID!, $dataManager: Boolean!) {
      setDataManager(userId: $userId, dataManager: $dataManager) {
        userId,
        dataManager
      }
    }`;

  const newDataManager = await gqlMutation(mutation, { userId, dataManager })
    .then(errorHandler('data.setDataManager'));
  return newDataManager;
}

async function setCatalogueRole(userId, catalogueRole) {
  const mutation = `
    SetCatalogueRole($userId: ID!, $catalogueRole: CatalogueRole!) {
      setCatalogueRole(userId: $userId, catalogueRole: $catalogueRole) {
        userId,
        catalogueRole
      }
    }`;

  const newCatalogueRole = await gqlMutation(mutation, { userId, catalogueRole })
    .then(errorHandler('data.setCatalogueRole'));
  return newCatalogueRole;
}

export default { getAllUsersAndRoles, setInstanceAdmin, setDataManager, setCatalogueRole };
