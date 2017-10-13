import stackActions, {
  LOAD_STACKS_ACTION,
  GET_STACK_URL_ACTION,
  OPEN_STACK_ACTION,
} from './stackActions';
import stackService from '../api/stackService';

jest.mock('../api/stackService');

describe('stackActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('loadStacks', () => {
      // Arrange
      const loadStacksMock = jest.fn().mockReturnValue('expectedNotebooksPayload');
      stackService.loadStacks = loadStacksMock;

      // Act
      const output = stackActions.loadStacks();

      // Assert
      expect(loadStacksMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_STACKS');
      expect(output.payload).toBe('expectedNotebooksPayload');
    });

    it('getUrl', () => {
      // Arrange
      const getUrlMock = jest.fn().mockReturnValue('expectedUrlPayload');
      stackService.getUrl = getUrlMock;

      // Act
      const output = stackActions.getUrl();

      // Assert
      expect(getUrlMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('GET_STACK_URL');
      expect(output.payload).toBe('expectedUrlPayload');
    });

    it('openStack', () => {
      // Arrange
      global.open = jest.fn();

      // Act
      stackActions.openStack('url');

      // Assert
      expect(global.open).toBeCalledWith('url');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_STACKS_ACTION', () => {
      expect(LOAD_STACKS_ACTION).toBe('LOAD_STACKS');
    });

    it('GET_STACK_URL_ACTION', () => {
      expect(GET_STACK_URL_ACTION).toBe('GET_STACK_URL');
    });

    it('OPEN_STACK_ACTION', () => {
      expect(OPEN_STACK_ACTION).toBe('OPEN_STACK');
    });
  });
});
