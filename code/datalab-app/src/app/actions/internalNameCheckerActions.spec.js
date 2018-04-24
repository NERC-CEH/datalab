import internalNameCheckerActions, { CHECK_NAME_UNIQUE_ACTION } from './internalNameCheckerActions';
import internalNameCheckerService from '../api/internalNameCheckerService';

jest.mock('../api/internalNameCheckerService');

describe('internalNameCheckerActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('checkNameUniqueness', () => {
      // Arrange
      const checkNameUniquenessMock = jest.fn().mockReturnValue('expectedCheckNamePayload');
      internalNameCheckerService.checkNameUniqueness = checkNameUniquenessMock;

      // Act
      const output = internalNameCheckerActions.checkNameUniqueness('nameForValidation');

      // Assert
      expect(checkNameUniquenessMock).toHaveBeenCalledTimes(1);
      expect(checkNameUniquenessMock).toBeCalledWith('nameForValidation');
      expect(output.type).toBe('CHECK_NAME_UNIQUE');
      expect(output.payload).toBe('expectedCheckNamePayload');
    });
  });

  describe('exports correct values for', () => {
    it('CHECK_NAME_UNIQUE_ACTION', () => {
      expect(CHECK_NAME_UNIQUE_ACTION).toBe('CHECK_NAME_UNIQUE');
    });
  });
});
