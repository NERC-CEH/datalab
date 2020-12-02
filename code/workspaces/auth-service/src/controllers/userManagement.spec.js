import httpMocks from 'node-mocks-http';
import userManagement from './userManagement';
import userRolesRepository from '../dataaccess/userRolesRepository';

jest.mock('../dataaccess/userRolesRepository');
const user = { userId: 123, name: 'test' };
const roles = { ...user, instanceAdmin: true };
const getUsersMock = jest.fn().mockResolvedValue([user]);
const getUserMock = jest.fn().mockResolvedValue(user);
const getAllUsersAndRolesMock = jest.fn().mockResolvedValue([{ ...roles }]);
const setInstanceAdminMock = jest.fn().mockResolvedValue(roles);
const setCatalogueRoleMock = jest.fn().mockResolvedValue(roles);
userRolesRepository.getUsers = getUsersMock;
userRolesRepository.getUser = getUserMock;
userRolesRepository.getAllUsersAndRoles = getAllUsersAndRolesMock;
userRolesRepository.setInstanceAdmin = setInstanceAdminMock;
userRolesRepository.setCatalogueRole = setCatalogueRoleMock;

describe('user management controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('get users', () => {
    it('should return users as JSON', async () => {
      // Arrange
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getUsers(undefined, response);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify([user]));
    });

    it('should return 500 if error', async () => {
      // Arrange
      getUsersMock.mockRejectedValue('no such catalogue');
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getUsers(request, response);

      // Assert
      expect(response.statusCode).toBe(500);
    });
  });

  describe('get user', () => {
    it('should return user if found', async () => {
      // Arrange
      const request = httpMocks.createRequest({ params: { userId: 123 } });
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getUser(request, response);

      // Assert
      expect(getUserMock).toBeCalledWith(123);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(user); // eslint-disable-line no-underscore-dangle
    });

    it('should return 404 if user not found', async () => {
      // Arrange
      getUserMock.mockRejectedValue('no such user');
      const request = httpMocks.createRequest({ params: { userId: 123 } });
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getUser(request, response);

      // Assert
      expect(response.statusCode).toBe(404);
    });
  });

  describe('getAllUsersAndRoles', () => {
    it('should return users and roles as JSON', async () => {
      // Arrange
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getAllUsersAndRoles(undefined, response);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify([roles]));
    });

    it('should return 500 if error', async () => {
      // Arrange
      getAllUsersAndRolesMock.mockRejectedValue('no such catalogue');
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.getAllUsersAndRoles(request, response);

      // Assert
      expect(response.statusCode).toBe(500);
    });
  });

  describe('setInstanceAdmin', () => {
    it('should return roles as JSON', async () => {
      // Arrange
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.setInstanceAdmin(request, response);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(roles);
    });

    it('should return 500 if error', async () => {
      // Arrange
      setInstanceAdminMock.mockRejectedValue('no such catalogue');
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.setInstanceAdmin(request, response);

      // Assert
      expect(response.statusCode).toBe(500);
    });
  });

  describe('setCatalogueRole', () => {
    it('should return roles as JSON', async () => {
      // Arrange
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.setCatalogueRole(request, response);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(roles);
    });

    it('should return 500 if error', async () => {
      // Arrange
      setCatalogueRoleMock.mockRejectedValue('no such catalogue');
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      // Act
      await userManagement.setCatalogueRole(request, response);

      // Assert
      expect(response.statusCode).toBe(500);
    });
  });
});
