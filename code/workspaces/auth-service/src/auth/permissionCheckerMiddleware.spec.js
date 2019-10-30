import httpMocks from 'node-mocks-http';
import { permissionTypes } from 'common';
import { permissionChecker, projectPermissionChecker } from './permissionCheckerMiddleware';

const { PROJECT_NAMESPACE, SYSTEM_INSTANCE_ADMIN } = permissionTypes;

jest.mock('winston');

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Permission Checker', () => {
    let request;

    beforeEach(() => {
      request = createRequest();
    });

    it('callback to be called if user has correct permission', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      return permissionChecker('elementName:actionName')(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('callback to be called if user is system instance admin even without other required permissions', () => {
      const response = httpMocks.createResponse();
      request.user.permissions.push(SYSTEM_INSTANCE_ADMIN);

      expect(actionMock).not.toHaveBeenCalled();
      return permissionChecker('permissions:user:does:not:have')(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('throws an error if user is lacking correct permission', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      permissionChecker('elementName:missingActionName')(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User missing required permission(s): elementName:missingActionName,system:instance:admin' });
    });

    it('throws error for shortened permission name', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      permissionChecker('elementName:actionNam')(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User missing required permission(s): elementName:actionNam,system:instance:admin' });
    });
  });

  describe('Project permission checker', () => {
    let request;
    const projectKey = 'testProj';
    const projectPermission = createProjectPermission('elementName:actionName');

    beforeEach(() => {
      request = createRequest(projectKey);
    });

    it('should call the callback if user has correct permission on project', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      return projectPermissionChecker(projectPermission)(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('callback to be called if user is system instance admin even without other required permissions', () => {
      const response = httpMocks.createResponse();
      request.user.permissions.push(SYSTEM_INSTANCE_ADMIN);

      expect(actionMock).not.toHaveBeenCalled();
      return permissionChecker('permissions:user:does:not:have')(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 401 if user does not have permission', () => {
      request.params = { projectKey: 'anotherproject' };
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      projectPermissionChecker(projectPermission)(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: `User missing required permission(s): ${PROJECT_NAMESPACE}:anotherproject:elementName:actionName,system:instance:admin` });
    });

    it('should return 401 if no project name included in request', () => {
      const response = httpMocks.createResponse();
      request.params.projectKey = undefined;

      expect(actionMock).not.toHaveBeenCalled();
      projectPermissionChecker('elementName:actionName')(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'Request missing parameter: projectKey' });
    });
  });
});

function createRequest(projectKey) {
  const request = {
    user: {
      permissions: [
        projectKey ? `${PROJECT_NAMESPACE}:${projectKey}:elementName:actionName` : 'elementName:actionName',
      ],
    },
  };

  if (projectKey) {
    request.params = { projectKey };
  }

  return request;
}

function createProjectPermission(permission) {
  return `${PROJECT_NAMESPACE}:?projectKey?:${permission}`;
}
