import projectSettingsActions, { GET_PROJECT_USER_PERMISSIONS_ACTION } from './projectSettingsActions';
import getProjectUsers from '../api/projectSettingsService';

jest.mock('../api/projectSettingsService');

describe('projectSettingsActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('getProjectUserPermissions', () => {
      getProjectUsers.mockReturnValue('expectedPayload');

      const output = projectSettingsActions.getProjectUserPermissions('project-ID');

      expect(getProjectUsers).toHaveBeenCalledTimes(1);
      expect(output.type).toBe(GET_PROJECT_USER_PERMISSIONS_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });
  });
});
