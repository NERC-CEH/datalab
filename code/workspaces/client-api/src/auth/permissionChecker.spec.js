import { permissionWrapper, multiPermissionsWrapper, instanceAdminWrapper, projectPermissionWrapper } from './permissionChecker';

const user = {
  permissions: [
    'project:elementName:actionName',
    'project2:elementName:actionName',
  ],
};

const admin = {
  permissions: [
    'system:instance:admin',
  ],
};

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

const next = () => actionMock('value');

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('permissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await permissionWrapper('elementName:missingActionName', user, next);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,system:instance:admin'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => permissionWrapper('elementName:actionName', user, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => permissionWrapper('elementName:actionName', admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('multiPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await multiPermissionsWrapper(['elementName:missingActionName', 'elementName:anotherAction'], user, next);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,project:elementName:anotherAction,system:instance:admin'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => multiPermissionsWrapper(['elementName:actionName', 'elementName:anotherAction'], user, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => multiPermissionsWrapper(['elementName:actionName'], admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('instanceAdminWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await instanceAdminWrapper(user, next);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('User missing expected permission(s): system:instance:admin'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has instance admin permission', () => instanceAdminWrapper(admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('projectPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:missingActionName', user, next);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('User missing expected permission(s): project2:elementName:missingActionName,system:instance:admin'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('throws an error if projectKey not passed', async () => {
      let error;
      try {
        await projectPermissionWrapper({}, 'elementName:actionName', user, next);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('projectKey not passed, expected suffix: elementName:actionName'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => {
      projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:actionName', user, next)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });

    it('callback to be called if user has instance admin permission', async () => {
      projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:actionName', admin, next)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });
  });
});
