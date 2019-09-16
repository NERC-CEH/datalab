import httpMocks from 'node-mocks-http';
import projectController from './projectController';
import userRolesRepository from '../dataaccess/userRolesRepository';

jest.mock('../dataaccess/userRolesRepository');
const getProjectUsers = jest.fn();
const addRole = jest.fn();
const removeRole = jest.fn();
const userIsMember = jest.fn();
userRolesRepository.getProjectUsers = getProjectUsers;
userRolesRepository.addRole = addRole;
userRolesRepository.removeRole = removeRole;
userRolesRepository.userIsMember = userIsMember;

describe('project controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('get project users', () => {
    it('should return mapped roles as JSON', async () => {
      getProjectUsers.mockReturnValue(Promise.resolve(rolesData()));
      const params = { params: { projectKey: 'project' } };

      const request = httpMocks.createRequest(params);
      const response = httpMocks.createResponse();

      await projectController.getUserRoles(request, response);

      const expectedResponse = [
        { userId: 'user1', role: 'admin' },
        { userId: 'user2', role: 'viewer' },
      ];

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(expectedResponse); // eslint-disable-line no-underscore-dangle
    });
  });

  describe('add user role', () => {
    it('should return 201 if role added', async () => {
      addRole.mockResolvedValue(true);
      const req = {
        params: { projectKey: 'project', userId: 'uid1' },
        body: { role: 'admin' },
      };

      const request = httpMocks.createRequest(req);
      const response = httpMocks.createResponse();

      await projectController.addUserRole(request, response);

      expect(response.statusCode).toBe(201);
    });

    it('should return 200 if role edited', async () => {
      addRole.mockResolvedValue(false);
      const req = {
        params: { projectKey: 'project', userId: 'uid1' },
        body: { role: 'admin' },
      };

      const request = httpMocks.createRequest(req);
      const response = httpMocks.createResponse();

      await projectController.addUserRole(request, response);

      expect(response.statusCode).toBe(200);
    });

    it('should return an error if add user role fails', async () => {
      addRole.mockRejectedValue('error');
      const req = {
        params: { projectKey: 'project', userId: 'uid1' },
        body: { role: 'admin' },
      };

      const request = httpMocks.createRequest(req);
      const response = httpMocks.createResponse();

      try {
        await projectController.addUserRole(request, response);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual('error');
      }
    });
  });

  describe('remove user role', () => {
    it('should return 200 if role added', async () => {
      removeRole.mockResolvedValue(true);
      const req = {
        params: { projectKey: 'project', userId: 'uid1' },
      };

      const request = httpMocks.createRequest(req);
      const response = httpMocks.createResponse();

      await projectController.removeUserRole(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual({ roleRemoved: true }); // eslint-disable-line no-underscore-dangle
    });
  });

  describe('is member', () => {
    it('should return 200 with boolean value', async () => {
      userIsMember.mockResolvedValue(true);
      const req = {
        params: { projectKey: 'projectKey' },
        user: { sub: 'userName' },
      };

      const request = httpMocks.createRequest(req);
      const response = httpMocks.createResponse();

      await projectController.isMember(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toBe('true'); // eslint-disable-line no-underscore-dangle
    });
  });
});

function rolesData() {
  return [
    {
      userId: 'user1',
      instanceAdmin: true,
      projectRoles: [
        { projectKey: 'project', role: 'admin' },
        { projectKey: 'project2', role: 'user' },
      ],
    },
    {
      userId: 'user2',
      instanceAdmin: true,
      projectRoles: [
        { projectKey: 'project', role: 'viewer' },
        { projectKey: 'project3', role: 'user' },
      ],
    },
  ];
}
