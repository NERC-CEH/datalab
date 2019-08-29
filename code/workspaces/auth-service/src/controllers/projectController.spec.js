import httpMocks from 'node-mocks-http';
import projectController from './projectController';
import userRolesRepository from '../dataaccess/userRolesRepository';

jest.mock('../dataaccess/userRolesRepository');
const getProjectUsers = jest.fn();
userRolesRepository.getProjectUsers = getProjectUsers;

describe('project controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('get project users', () => {
    it('should return mapped roles as JSON', async () => {
      getProjectUsers.mockReturnValue(Promise.resolve(rolesData()));
      const params = { params: { projectName: 'project' } };

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
});

function rolesData() {
  return [
    {
      userId: 'user1',
      instanceAdmin: true,
      projectRoles: [
        {
          projectName: 'project',
          role: 'admin',
        },
        {
          projectName: 'project2',
          role: 'user',
        },
      ],
    },
    {
      userId: 'user2',
      instanceAdmin: true,
      projectRoles: [
        {
          projectName: 'project',
          role: 'viewer',
        },
        {
          projectName: 'project3',
          role: 'user',
        },
      ],
    },
  ];
}
