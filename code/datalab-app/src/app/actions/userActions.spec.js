import userActions, { LIST_USERS_ACTION } from './userActions';
import listUsersService from '../api/listUsersService';

jest.mock('../api/listUsersService');

describe('userActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('listUsers', () => {
      // Arrange
      const listUsersMock = jest.fn().mockReturnValue('expectedPayload');
      listUsersService.listUsers = listUsersMock;

      // Act
      const output = userActions.listUsers();

      // Assert
      expect(listUsersMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LIST_USERS');
      expect(output.payload).toBe('expectedPayload');
    });

    describe('exports correct value for', () => {
      it('LIST_USERS_ACTION', () => {
        expect(LIST_USERS_ACTION).toBe('LIST_USERS');
      });
    });
  });
});
