import { permissionTypes } from 'common';
import projectPermissionMiddleware, { getProjectKeyFromRequest } from './projectPermissionMiddleware';
import * as utils from './utils';

const {
  projectPermissions: { PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST },
  SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER,
  projectKeyPermission,
} = permissionTypes;

const { getPermissionsHandled, getMiddleware } = projectPermissionMiddleware;

describe('getPermissionsHandled', () => {
  it('filters out any permissions that are not project permissions', () => {
    const permissions = [PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST, SYSTEM_DATA_MANAGER, SYSTEM_INSTANCE_ADMIN];
    const returnValue = getPermissionsHandled(permissions);
    expect(returnValue).toEqual([PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST]);
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

    it('keeps permission as not granted, adds an error to error array and calls next if there is no projectKey in the request', () => {
      const requestMock = {};
      initPermissionStructureOnRequest(requestMock);
      const middleware = getMiddleware([]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeFalsy();
      expect(utils.permissionErrors(requestMock)).toMatchSnapshot();
      expect(nextMock).toHaveBeenCalledWith();
    });

    it('grants permission, does not add error to error array and calls next if user has permission', () => {
      const projectKey = 'testproj';
      const requestMock = {
        user: { permissions: [projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)] },
        body: { projectKey },
      };
      initPermissionStructureOnRequest(requestMock);
      const middleware = getMiddleware([PROJECT_KEY_STACKS_LIST]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeTruthy();
      expect(utils.permissionErrors(requestMock)).toEqual([]);
      expect(nextMock).toHaveBeenCalledWith();
    });

    it('keeps permission as not granted, adds error to error array and calls next if user does not have required permission', () => {
      const requestMock = {
        user: { permissions: ['unacceptable:permission'] },
        body: { projectKey: 'testproj' },
      };
      initPermissionStructureOnRequest(requestMock);
      const middleware = getMiddleware([PROJECT_KEY_STACKS_LIST]);

      middleware(requestMock, responseMock, nextMock);

      expect(utils.permissionGranted(requestMock)).toBeFalsy();
      expect(utils.permissionErrors(requestMock)).toMatchSnapshot();
      expect(nextMock).toHaveBeenCalledWith();
    });
  });
});

describe('getProjectKeyFromRequest', () => {
  it('returns projectKey when provided in request body', () => {
    const projectKey = 'testproj';
    const requestMock = { body: { projectKey } };
    const returnValue = getProjectKeyFromRequest(requestMock);
    expect(returnValue).toEqual(projectKey);
  });

  it('returns projectKey when provided in request params', () => {
    const projectKey = 'testproj';
    const requestMock = { params: { projectKey } };
    const returnValue = getProjectKeyFromRequest(requestMock);
    expect(returnValue).toEqual(projectKey);
  });

  it('returns projectKey when provided in request query', () => {
    const projectKey = 'testproj';
    const requestMock = { query: { projectKey } };
    const returnValue = getProjectKeyFromRequest(requestMock);
    expect(returnValue).toEqual(projectKey);
  });

  it('returns undefined if projectKey not provided in request', () => {
    const requestMock = {};
    const returnValue = getProjectKeyFromRequest(requestMock);
    expect(returnValue).toBeUndefined();
  });
});
