import { permissionTypes } from 'common';
import projectPermissionWrapper from './permissionChecker';

const { PROJECT_NAMESPACE } = permissionTypes;

const user = {
  permissions: [
    'elementName:actionName',
    `${PROJECT_NAMESPACE}:testProject:elementName:actionName`,
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

    it('callback to be called if user has correct permission when single suffix passed', async () => {
      await projectPermissionWrapper({ projectKey: 'testProject' }, 'elementName:actionName', user, done);

      expect(actionMock).toHaveBeenCalledTimes(1);
      expect(actionMock).toHaveBeenCalledWith('value');
    });

    it('callback to be called if user has correct permission when multiple suffix passed', async () => {
      await projectPermissionWrapper({ projectKey: 'testProject' }, ['elementName:missingActionName', 'elementName:actionName'], user, done);

      expect(actionMock).toHaveBeenCalledTimes(1);
      expect(actionMock).toHaveBeenCalledWith('value');
    });

    it('callback to be called if user has instance admin permission but no project permission', async () => {
      await projectPermissionWrapper({ projectKey: 'project2' }, 'elementName:actionName', admin, done);

      expect(actionMock).toHaveBeenCalledTimes(1);
      expect(actionMock).toHaveBeenCalledWith('value1');
    });
  });
});
