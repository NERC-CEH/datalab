import httpMocks from 'node-mocks-http';
import { permissionChecker, projectPermissionChecker } from './permissionCheckerMiddleware';

jest.mock('winston');

let request;
const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    request = createRequest();
  });

  describe('Permission Checker', () => {
    it('callback to be called if user has correct permission', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      return permissionChecker(['elementName:actionName'])(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('throws an error if user is lacking correct permission', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      permissionChecker(['elementName:missingActionName'])(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User missing expected permission(s): project:elementName:missingActionName,system:instance:admin' });
    });

    it('throws error for shortened permission name', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      permissionChecker(['elementName:actionNam'])(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User missing expected permission(s): project:elementName:actionNam,system:instance:admin' });
    });
  });

  describe('Project permission checker', () => {
    it('should call the callback if user has correct permission on project', () => {
      request.params = { projectKey: 'project' };
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      return projectPermissionChecker(['elementName:actionName'])(request, response, actionMock)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 401 if user does not have permission', () => {
      request.params = { projectKey: 'anotherproject' };
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      projectPermissionChecker(['elementName:actionName'])(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User missing expected permission(s): anotherproject:elementName:actionName,system:instance:admin' });
    });

    it('should return 401 if no project name included in request', () => {
      const response = httpMocks.createResponse();

      expect(actionMock).not.toHaveBeenCalled();
      projectPermissionChecker(['elementName:actionName'])(request, response, actionMock);
      expect(actionMock).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'Request missing parameter: projectKey' });
    });
  });
});

function createRequest() {
  return {
    user: {
      permissions: [
        'project:elementName:actionName',
      ],
    },
  };
}
