import { permissionTypes } from 'common';
import systemPermissionMiddleware from './systemPermissionMiddleware';
import * as utils from './utils';

const {
  projectPermissions: { PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST },
  SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER,
} = permissionTypes;

const { getPermissionsHandled, getMiddleware } = systemPermissionMiddleware;

describe('getPermissionsHandled', () => {
  it('filters out any permissions that are not system permissions', () => {
    const permissions = [PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST, SYSTEM_DATA_MANAGER, SYSTEM_INSTANCE_ADMIN];
    const returnValue = getPermissionsHandled(permissions);
    expect(returnValue).toEqual([SYSTEM_DATA_MANAGER, SYSTEM_INSTANCE_ADMIN]);
  });
});

describe('getMiddleware', () => {
  const responseMock = jest.fn();
  const nextMock = jest.fn();

  const initPermissionStructureOnRequest = (requestMock) => {
    utils.initRequestPermissionInfoStructureMiddleware(requestMock, responseMock, nextMock);
    nextMock.mockClear(); // clear the call to next in the init structure middleware
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('returns middleware that', () => {
    it('keeps permission as granted, does not add an error to error array and calls next if permission already granted', () => {
      const requestMock = {};
      initPermissionStructureOnRequest(requestMock);
      utils.grantPermission(requestMock);
      const middleware = getMiddleware([]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeTruthy();
      expect(utils.permissionErrors(requestMock)).toEqual([]);
      expect(nextMock).toHaveBeenCalledWith();
    });

    it('grants permission, does not add error to error array and calls next if user has permission', () => {
      const requestMock = {
        user: { permissions: [SYSTEM_INSTANCE_ADMIN] },
      };
      initPermissionStructureOnRequest(requestMock);
      const middleware = getMiddleware([SYSTEM_INSTANCE_ADMIN]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeTruthy();
      expect(utils.permissionErrors(requestMock)).toEqual([]);
      expect(nextMock).toHaveBeenCalledWith();
    });

    it('keeps permission as not granted, adds error to error array and calls next if user does not have required permission', () => {
      const requestMock = {
        user: { permissions: ['unacceptable:permission'] },
      };
      initPermissionStructureOnRequest(requestMock);
      const middleware = getMiddleware([SYSTEM_INSTANCE_ADMIN]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeFalsy();
      expect(utils.permissionErrors(requestMock)).toMatchSnapshot();
      expect(nextMock).toHaveBeenCalledWith();
    });
  });
});
