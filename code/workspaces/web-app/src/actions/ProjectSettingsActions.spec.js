import projectSettingsActions, {
  GET_PROJECT_USER_PERMISSIONS_ACTION,
  ADD_PROJECT_USER_PERMISSION_ACTION,
  REMOVE_PROJECT_USER_PERMISSION_ACTION,
} from './projectSettingsActions';
import {
  getProjectUsers,
  addProjectUserPermission,
  removeProjectPermission,
} from '../api/projectSettingsService';

jest.mock('../api/projectSettingsService');

describe('projectSettingsActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('getProjectUsers', () => {
      getProjectUsers.mockReturnValue('expectedPayload');

      const output = projectSettingsActions.getProjectUserPermissions('project-ID');

      expect(getProjectUsers).toHaveBeenCalledTimes(1);
      expect(getProjectUsers).toHaveBeenCalledWith('project-ID');
      expect(output.type).toEqual(GET_PROJECT_USER_PERMISSIONS_ACTION);
      expect(output.payload).toEqual('expectedPayload');
    });

    it('addProjectUserPermissions', async () => {
      const projectKey = 'projectKey';
      const user = { name: 'System User', userId: 'system-user' };
      const role = 'admin';
      const result = { projectKey, role };
      addProjectUserPermission.mockReturnValue(new Promise(resolve => resolve(result)));

      const output = projectSettingsActions.addUserPermission(projectKey, user, role);

      expect(addProjectUserPermission).toHaveBeenCalledTimes(1);
      expect(addProjectUserPermission).toHaveBeenCalledWith(projectKey, user.userId, role);
      expect(output.type).toEqual(ADD_PROJECT_USER_PERMISSION_ACTION);
      expect(await output.payload).toEqual({ ...result, user });
    });

    it('removeProjectUserPermissions', async () => {
      const projectKey = 'projectKey';
      const user = { name: 'System User', userId: 'system-user' };
      const result = user;
      removeProjectPermission.mockReturnValue(new Promise(resolve => resolve(result)));

      const output = projectSettingsActions.removeUserPermission(projectKey, user);

      expect(removeProjectPermission).toHaveBeenCalledTimes(1);
      expect(removeProjectPermission).toHaveBeenCalledWith(projectKey, user.userId);
      expect(output.type).toEqual(REMOVE_PROJECT_USER_PERMISSION_ACTION);
      expect(await output.payload).toEqual(result);
    });
  });
});
