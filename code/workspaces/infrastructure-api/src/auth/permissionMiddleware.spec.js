import { permissionTypes } from 'common';
import permissionMiddleware from './permissionMiddleware';
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

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

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
