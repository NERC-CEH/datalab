import notebookActions, {
  LOAD_NOTEBOOKS_ACTION,
  OPEN_NOTEBOOK_ACTION,
} from './notebookActions';
import notebookService from '../api/notebookService';
import zeppelinService from '../api/zeppelinService';

jest.mock('../api/notebookService');
jest.mock('../api/zeppelinService');

describe('dataStorageActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('loadNotebooks', () => {
      // Arrange
      const loadNotebooksMock = jest.fn().mockReturnValue('expectedNotebooksPayload');
      notebookService.loadNotebooks = loadNotebooksMock;

      // Act
      const output = notebookActions.loadNotebooks();

      // Assert
      expect(loadNotebooksMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_NOTEBOOKS');
      expect(output.payload).toBe('expectedNotebooksPayload');
    });

    it('openNotebook', () => {
      // Arrange
      const zeppelinMock = jest.fn().mockReturnValue('expectedPayload');
      zeppelinService.openNotebook = zeppelinMock;

      // Act
      const output = notebookActions.openNotebook('url', 'cookie');

      // Assert
      expect(zeppelinMock).toHaveBeenCalledTimes(1);
      expect(zeppelinMock).toHaveBeenCalledWith('url', 'cookie');
      expect(output.type).toBe(OPEN_NOTEBOOK_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_NOTEBOOKS_ACTION', () => {
      expect(LOAD_NOTEBOOKS_ACTION).toBe('LOAD_NOTEBOOKS');
    });

    it('OPEN_NOTEBOOK_ACTION', () => {
      expect(OPEN_NOTEBOOK_ACTION).toBe('OPEN_NOTEBOOK');
    });
  });
});
