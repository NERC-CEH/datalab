import { permissionWrapper, multiPermissionsWrapper, instanceAdminWrapper } from './permissionChecker';

const user = {
  permissions: [
    'project:elementName:actionName',
  ],
};

const admin = {
  permissions: [
    'system:instance:admin',
  ],
};

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('permissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () => permissionWrapper('elementName:missingActionName', user, () => actionMock('value'))
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has correct permission', () => permissionWrapper('elementName:actionName', user, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => permissionWrapper('elementName:actionName', admin, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('multiPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () => multiPermissionsWrapper(['elementName:missingActionName', 'elementName:anotherAction'], user, () => actionMock('value'))
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,project:elementName:anotherAction,system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has correct permission', () => multiPermissionsWrapper(['elementName:actionName', 'elementName:anotherAction'], user, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => multiPermissionsWrapper(['elementName:actionName'], admin, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('instanceAdminWrapper', () => {
    it('throws an error if user is lacking correct permission', () => instanceAdminWrapper(user, () => actionMock('value'))
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has instance admin permission', () => instanceAdminWrapper(admin, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });
});
