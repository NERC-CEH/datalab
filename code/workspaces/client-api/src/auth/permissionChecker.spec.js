import { permissionTypes } from 'common';
import { permissionWrapper, multiPermissionsWrapper, instanceAdminWrapper, projectPermissionWrapper } from './permissionChecker';

const { PROJECT_NAMESPACE } = permissionTypes;

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

const done = () => actionMock('value');

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('permissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await permissionWrapper('elementName:missingActionName', user, done);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error(`User missing expected permission(s): ${PROJECT_NAMESPACE}:project:elementName:missingActionName,system:instance:admin`));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => permissionWrapper('elementName:actionName', user, done)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => permissionWrapper('elementName:actionName', admin, done)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('multiPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await multiPermissionsWrapper(['elementName:missingActionName', 'elementName:anotherAction'], user, done);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error(`User missing expected permission(s): ${PROJECT_NAMESPACE}:project:elementName:missingActionName,`
        .concat(`${PROJECT_NAMESPACE}:project:elementName:anotherAction,system:instance:admin`)));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => multiPermissionsWrapper(['elementName:actionName', 'elementName:anotherAction'], user, done)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => multiPermissionsWrapper(['elementName:actionName'], admin, done)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('instanceAdminWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await instanceAdminWrapper(user, done);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('User missing expected permission(s): system:instance:admin'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has instance admin permission', () => instanceAdminWrapper(admin, done)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('projectPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', async () => {
      let error;
      try {
        await projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:missingActionName', user, done);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error(`User missing expected permission(s): ${PROJECT_NAMESPACE}:project2:elementName:missingActionName,system:instance:admin`));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('throws an error if projectKey not passed', async () => {
      let error;
      try {
        await projectPermissionWrapper({}, 'elementName:actionName', user, done);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(new Error('projectKey not passed, expected suffix: elementName:actionName'));
      expect(actionMock).not.toHaveBeenCalled();
    });

    it('callback to be called if user has correct permission', () => {
      projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:actionName', user, done)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });

    it('callback to be called if user has instance admin permission', async () => {
      projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:actionName', admin, done)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });
  });
});
