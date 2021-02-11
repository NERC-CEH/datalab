import { permissionTypes } from 'common';
import httpMocks from 'node-mocks-http';
import permissionMiddleware, { projectPermissionWrapper, systemAdminPermissionWrapper, systemDataManagerPermissionWrapper } from './permissionMiddleware';
import * as permissionMiddlewareUtilsMock from './subPermissionMiddleware/utils';
import systemPermissionMiddlewareMock from './subPermissionMiddleware/systemPermissionMiddleware';
import projectPermissionMiddlewareMock from './subPermissionMiddleware/projectPermissionMiddleware';

jest.mock('./subPermissionMiddleware/utils');

// Due to the way jest.mock works, unable to split out anything common between these mocks
jest.mock('./subPermissionMiddleware/systemPermissionMiddleware', () => ({
  default: { getPermissionsHandled: jest.fn(), getMiddleware: jest.fn() },
  __esModule: true,
}));
jest.mock('./subPermissionMiddleware/projectPermissionMiddleware', () => ({
  default: { getPermissionsHandled: jest.fn(), getMiddleware: jest.fn() },
  __esModule: true,
}));

const { projectPermissions: { PROJECT_KEY_STACKS_LIST }, SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER } = permissionTypes;

describe('projectPermissionWrapper', () => {
  describe('when projectKey is provided in request', () => {
    describe('when user has correct project permissions', () => {
      const userPermissions = ['projects:testkey:stacks:list'];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = httpMocks.createRequest({
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user is system admin without correct project permissions', () => {
      const userPermissions = [SYSTEM_INSTANCE_ADMIN];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = httpMocks.createRequest({
          query: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = httpMocks.createRequest({
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user does not have correct user permissions or system admin', () => {
      const userPermissions = ['incorrect:permissions'];

      it('fails with 401 and does not call next', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(responseMock.statusCode).toEqual(401);
        expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
        expect(nextMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when projectKey not provided', () => {
    it('fails with a 400 and does not call next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [] } });
      const responseMock = httpMocks.createResponse();
      const nextMock = jest.fn();

      projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

      expect(responseMock.statusCode).toEqual(400);
      expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});

describe('systemAdminPermissionWrapper', () => {
  describe('when user is system admin', () => {
    it('calls next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [SYSTEM_INSTANCE_ADMIN] } });
      const responseMock = jest.fn();
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(responseMock).not.toHaveBeenCalled();
    });
  });

  describe('when user is not system admin', () => {
    it('fails with a 401, error message matching snapshot and does not call next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [] } });
      const responseMock = httpMocks.createResponse();
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(responseMock.statusCode).toEqual(401);
      expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});

describe('systemDataManagerPermissionWrapper', () => {
  describe('when user is a data manager', () => {
    it('calls next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [SYSTEM_DATA_MANAGER] } });
      const responseMock = jest.fn();
      const nextMock = jest.fn();

      systemDataManagerPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(responseMock).not.toHaveBeenCalled();
    });
  });

  describe('when user is not a data manager', () => {
    it('fails with a 401, error message matching snapshot and does not call next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [] } });
      const responseMock = httpMocks.createResponse();
      const nextMock = jest.fn();

      systemDataManagerPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(responseMock.statusCode).toEqual(401);
      expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});

describe('permissionMiddleware', () => {
  systemPermissionMiddlewareMock.getPermissionsHandled.mockReturnValue(['system:test:permission']);
  projectPermissionMiddlewareMock.getPermissionsHandled.mockReturnValue(['project:test:permission']);

  const configuredSystemPermissionMiddleware = jest.fn();
  const configuredProjectPermissionMiddleware = jest.fn();

  systemPermissionMiddlewareMock.getMiddleware.mockReturnValue(configuredSystemPermissionMiddleware);
  projectPermissionMiddlewareMock.getMiddleware.mockReturnValue(configuredProjectPermissionMiddleware);

  it('has middleware to initialise the permission infrastructure on the request as first middleware', () => {
    const middleware = permissionMiddleware();
    expect(middleware[0]).toBe(permissionMiddlewareUtilsMock.initRequestPermissionInfoStructureMiddleware);
  });

  it('has middleware to ensure that permission has been granted on the request as the last middleware', () => {
    const middleware = permissionMiddleware();
    expect(middleware[middleware.length - 1]).toBe(permissionMiddlewareUtilsMock.ensurePermissionGrantedMiddleware);
  });

  it('filters middleware that does not handle any of the accepted permissions', () => {
    projectPermissionMiddlewareMock.getPermissionsHandled.mockReturnValueOnce([]);

    const middleware = permissionMiddleware();

    expect(middleware).toContain(configuredSystemPermissionMiddleware);
    expect(middleware).not.toContain(configuredProjectPermissionMiddleware);
  });

  it('calls to find the permissions that the middleware handles out of provided accepted permissions and system admin', () => {
    const acceptedPermissions = ['test:accepted:permission'];
    const expectedPermissions = [...acceptedPermissions, SYSTEM_INSTANCE_ADMIN];

    permissionMiddleware(...acceptedPermissions);

    expect(systemPermissionMiddlewareMock.getPermissionsHandled).toHaveBeenCalledWith(expectedPermissions);
    expect(projectPermissionMiddlewareMock.getPermissionsHandled).toHaveBeenCalledWith(expectedPermissions);
  });

  it('calls to configure middleware with permissions the middleware handles', () => {
    permissionMiddleware();
    expect(systemPermissionMiddlewareMock.getMiddleware).toHaveBeenCalledWith(['system:test:permission']);
    expect(projectPermissionMiddlewareMock.getMiddleware).toHaveBeenCalledWith(['project:test:permission']);
  });
});
