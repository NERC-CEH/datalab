import { permissionWrapper, multiPermissionsWrapper } from './permissionChecker';

const user = {
  permissions: [
    'project:elementName:actionName',
  ],
};

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('permissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () =>
      permissionWrapper('elementName:missingActionName', user, () => actionMock('value'))
        .catch((err) => {
          expect(err).toBe('User missing expected permission(s): project:elementName:missingActionName');
          expect(actionMock).not.toHaveBeenCalled();
        }));

    it('callback to be called if user has correct permission', () =>
      permissionWrapper('elementName:actionName', user, () => actionMock('value'))
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        }));
  });

  describe('multiPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () =>
      multiPermissionsWrapper(['elementName:missingActionName', 'elementName:anotherAction'], user, () => actionMock('value'))
        .catch((err) => {
          expect(err).toBe('User missing expected permission(s): project:elementName:missingActionName,project:elementName:anotherAction');
          expect(actionMock).not.toHaveBeenCalled();
        }));

    it('callback to be called if user has correct permission', () =>
      permissionWrapper(['elementName:actionName', 'elementName:anotherAction'], user, () => actionMock('value'))
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        }));
  });
});
