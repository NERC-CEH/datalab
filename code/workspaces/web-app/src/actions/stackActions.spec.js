import stackActions, {
  LOAD_STACKS_ACTION,
  LOAD_STACKS_BY_CATEGORY_ACTION,
  GET_STACK_URL_ACTION,
  OPEN_STACK_ACTION,
  CREATE_STACK_ACTION,
  DELETE_STACK_ACTION,
  UPDATE_STACK_SHARE_STATUS_ACTION,
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

    it('loadStackByCategory', () => {
      // Arrange
      const loadStacksByCategoryMock = jest.fn().mockReturnValue('expectedStackPayload');
      stackService.loadStacksByCategory = loadStacksByCategoryMock;

      // Act
      const output = stackActions.loadStacksByCategory('expectedProjectKey', 'expectedCategory');

      // Assert
      expect(loadStacksByCategoryMock).toHaveBeenCalledTimes(1);
      expect(loadStacksByCategoryMock).toBeCalledWith('expectedProjectKey', 'expectedCategory');
      expect(output.type).toBe('LOAD_STACKS_BY_CATEGORY');
      expect(output.payload).toBe('expectedStackPayload');
    });

    it('getUrl', () => {
      // Arrange
      const getUrlMock = jest.fn().mockReturnValue('expectedUrlPayload');
      stackService.getUrl = getUrlMock;

      // Act
      const output = stackActions.getUrl('testproj', 'expected_id_1234');

      // Assert
      expect(getUrlMock).toHaveBeenCalledTimes(1);
      expect(getUrlMock).toBeCalledWith('testproj', 'expected_id_1234');
      expect(output.type).toBe('GET_STACK_URL');
      expect(output.payload).toBe('expectedUrlPayload');
    });

    it('openStack', () => {
      // Arrange
      global.open = jest.fn();

      // Act
      const output = stackActions.openStack('url');

      // Assert
      expect(global.open).toHaveBeenCalledTimes(1);
      expect(global.open).toBeCalledWith('url');
      expect(output.type).toBe('OPEN_STACK');
    });

    it('createStack', () => {
      // Arrange
      const createStackMock = jest.fn().mockReturnValue('expectedStackPayload');
      stackService.createStack = createStackMock;

      // Act
      const output = stackActions.createStack('expectedStack');

      // Assert
      expect(createStackMock).toHaveBeenCalledTimes(1);
      expect(createStackMock).toBeCalledWith('expectedStack');
      expect(output.type).toBe('CREATE_STACK');
      expect(output.payload).toBe('expectedStackPayload');
    });

    it('deleteStack', () => {
      // Arrange
      const stack = { name: 'expectedType', type: 'expectedType' };
      const deleteStackMock = jest.fn().mockReturnValue('expectedStackPayload');
      stackService.deleteStack = deleteStackMock;

      // Act
      const output = stackActions.deleteStack(stack);

      // Assert
      expect(deleteStackMock).toHaveBeenCalledTimes(1);
      expect(deleteStackMock).toBeCalledWith(stack);
      expect(output.type).toBe('DELETE_STACK');
      expect(output.payload).toBe('expectedStackPayload');
    });

    it('updateStackShareStatus', () => {
      // Arrange
      const stack = { name: 'expectedType', projectKey: 'test', shared: 'private' };
      const updateStackShareStatusMock = jest.fn().mockReturnValue('expectedStackPayload');
      stackService.updateStackShareStatus = updateStackShareStatusMock;

      // Act
      const output = stackActions.updateStackShareStatus(stack);

      // Assert
      expect(updateStackShareStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStackShareStatusMock).toBeCalledWith(stack);
      expect(output.type).toBe('UPDATE_STACK_SHARE_STATUS');
      expect(output.payload).toBe('expectedStackPayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_STACKS_ACTION', () => {
      expect(LOAD_STACKS_ACTION).toBe('LOAD_STACKS');
    });

    it('LOAD_STACKS_BY_CATEGORY', () => {
      expect(LOAD_STACKS_BY_CATEGORY_ACTION).toBe('LOAD_STACKS_BY_CATEGORY');
    });

    it('GET_STACK_URL_ACTION', () => {
      expect(GET_STACK_URL_ACTION).toBe('GET_STACK_URL');
    });

    it('OPEN_STACK_ACTION', () => {
      expect(OPEN_STACK_ACTION).toBe('OPEN_STACK');
    });

    it('CREATE_STACK_ACTION', () => {
      expect(CREATE_STACK_ACTION).toBe('CREATE_STACK');
    });

    it('DELETE_STACK_ACTION', () => {
      expect(DELETE_STACK_ACTION).toBe('DELETE_STACK');
    });

    it('UPDATE_STACK_SHARE_STATUS_ACTION', () => {
      expect(UPDATE_STACK_SHARE_STATUS_ACTION).toBe('UPDATE_STACK_SHARE_STATUS');
    });
  });
});
