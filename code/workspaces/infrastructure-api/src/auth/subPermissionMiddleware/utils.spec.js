import * as utils from './utils';

const { REQUEST_PERMISSION_INFO_KEY } = utils;

const getConfiguredRequestMock = ({ granted, errors }) => ({
  [REQUEST_PERMISSION_INFO_KEY]: { granted, errors },
});

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('initRequestPermissionInfoStructureMiddleware', () => {
  it('adds request info permission structure to request and calls next', () => {
    const requestMock = {};

    utils.initRequestPermissionInfoStructureMiddleware(requestMock, responseMock, nextMock);

    expect(requestMock).toEqual({ [REQUEST_PERMISSION_INFO_KEY]: { granted: false, errors: [] } });
    expect(nextMock).toHaveBeenCalledWith();
  });
});

describe('ensurePermissionGrantedMiddleware', () => {
  const { ensurePermissionGrantedMiddleware } = utils;

  it('calls next if permission has been granted and response not sent', () => {
    const requestMock = getConfiguredRequestMock({ granted: true, errors: [] });

    ensurePermissionGrantedMiddleware(requestMock, responseMock, nextMock);

    expect(nextMock).toHaveBeenCalledWith();
    expect(responseMock.send).not.toHaveBeenCalled();
  });

  it('returns response configured with 401 status and error message when permission not granted and next not called', () => {
    const requestMock = getConfiguredRequestMock({ granted: false, errors: ['expected error'] });

    ensurePermissionGrantedMiddleware(requestMock, responseMock, nextMock);

    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(responseMock.send).toHaveBeenCalledWith({ permissionGranted: false, errors: ['expected error'] });
    expect(nextMock).not.toHaveBeenCalled();
  });
});

describe('getRequestPermissionInfo', () => {
  it('returns the permission information stored on the request', () => {
    const permissionInfo = { granted: true, errors: [] };
    const requestMock = getConfiguredRequestMock(permissionInfo);
    const returnValue = utils.getRequestPermissionInfo(requestMock);
    expect(returnValue).toEqual(permissionInfo);
  });
});

describe('permissionGranted', () => {
  it('returns the value of granted from the permission info object on the request', () => {
    const permissionGranted = true;
    const requestMock = getConfiguredRequestMock({
      granted: permissionGranted,
      errors: [],
    });
    const returnValue = utils.permissionGranted(requestMock);
    expect(returnValue).toEqual(permissionGranted);
  });
});

describe('grantPermission', () => {
  it('sets the value of granted to true when the current value is false', () => {
    const requestMock = getConfiguredRequestMock({ granted: false, errors: [] });
    utils.grantPermission(requestMock);
    expect(utils.permissionGranted(requestMock)).toBeTruthy();
  });

  it('keeps the value of granted as true if it is already set to be true', () => {
    const requestMock = getConfiguredRequestMock({ granted: true, errors: [] });
    utils.grantPermission(requestMock);
    expect(utils.permissionGranted(requestMock)).toBeTruthy();
  });
});

describe('permissionErrors', () => {
  it('returns array of errors from the permission info object on the request', () => {
    const requestMock = getConfiguredRequestMock({ granted: false, errors: ['expected test error'] });
    const returnValue = utils.permissionErrors(requestMock);
    expect(returnValue).toEqual(['expected test error']);
  });
});

describe('addPermissionError', () => {
  it('adds permission error to the array of errors in the permission info object on the request', () => {
    const requestMock = getConfiguredRequestMock({ granted: false, errors: [] });
    const errorMessage = 'expected test error';
    utils.addPermissionError(requestMock, errorMessage);
    expect(utils.permissionErrors(requestMock)).toEqual([errorMessage]);
  });

  it('can be used to add more than one error to the errors array', () => {
    const requestMock = getConfiguredRequestMock({ granted: false, errors: [] });
    utils.addPermissionError(requestMock, 'error-one');
    utils.addPermissionError(requestMock, 'error-two');
    utils.addPermissionError(requestMock, 'error-three');
    expect(utils.permissionErrors(requestMock)).toEqual(['error-one', 'error-two', 'error-three']);
  });
});

describe('containsPermission', () => {
  const { containsPermission } = utils;
  const acceptedPermissions = ['accepted-one', 'accepted-two', 'accepted-three'];
  const grantedPermissions = ['granted-one', 'granted-two', 'granted-three'];

  it('returns true if an item in granted permissions is in the accepted permissions array', () => {
    const result = containsPermission(acceptedPermissions, [...grantedPermissions, 'accepted-three']);
    expect(result).toBeTruthy();
  });

  it('returns false if non of the items in granted permissions are in the accepted permissions array', () => {
    const result = containsPermission(acceptedPermissions, grantedPermissions);
    expect(result).toBeFalsy();
  });

  it('returns false if the accepted permissions array is empty', () => {
    const result = containsPermission([], grantedPermissions);
    expect(result).toBeFalsy();
  });

  it('returns false if the granted permissions array is empty', () => {
    const result = containsPermission(acceptedPermissions, []);
    expect(result).toBeFalsy();
  });
});

describe('getUserPermissionsFromRequest', () => {
  it('returns the user permissions from the request when there are permissions', () => {
    const request = { user: { permissions: ['user-permission-one', 'user-permission-two'] } };
    const returnValue = utils.getUserPermissionsFromRequest(request);
    expect(returnValue).toEqual(['user-permission-one', 'user-permission-two']);
  });

  it('returns an empty array if there are no user-permissions on the request', () => {
    const request = {};
    const returnValue = utils.getUserPermissionsFromRequest(request);
    expect(returnValue).toEqual([]);
  });
});

describe('permissionsMatchingRegExp', () => {
  it('returns array of permissions that match the passed regular expression', () => {
    const permissions = ['match-one', 'no-match-one', 'match-two', 'no-match-two', 'no-match-three'];
    const regexp = new RegExp('^match'); // match any permission starting with 'match'
    const returnValue = utils.permissionsMatchingRegExp(permissions, regexp);
    expect(returnValue).toEqual(['match-one', 'match-two']);
  });
});

describe('exportMiddleware', () => {
  it('puts provided arguments into object with expected keys', () => {
    const handledPermissionsMock = jest.fn();
    const middlewareMock = jest.fn();

    const returnValue = utils.exportMiddleware(handledPermissionsMock, middlewareMock);

    expect(returnValue.getPermissionsHandled).toBe(handledPermissionsMock);
    expect(returnValue.getMiddleware).toBe(middlewareMock);
  });
});
