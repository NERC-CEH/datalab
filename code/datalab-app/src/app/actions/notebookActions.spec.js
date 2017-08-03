import notebookActions, {
  LOAD_NOTEBOOKS_ACTION,
  SET_COOKIE_ACTION,
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

    it('setNotebookCookie', () => {
      // Arrange
      const zeppelinMock = jest.fn().mockReturnValue('expectedPayload');
      zeppelinService.setCookie = zeppelinMock;

      // Act
      const output = notebookActions.setNotebookCookie('url', 'cookie');

      // Assert
      expect(zeppelinMock).toHaveBeenCalledTimes(1);
      expect(zeppelinMock).toHaveBeenCalledWith('url', 'cookie');
      expect(output.type).toBe(SET_COOKIE_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });

    it('openNotebook', () => {
      // Arrange
      global.open = jest.fn();

      // Act
      notebookActions.openNotebook('url');

      // Assert
      expect(global.open).toBeCalledWith('url');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_NOTEBOOKS_ACTION', () => {
      expect(LOAD_NOTEBOOKS_ACTION).toBe('LOAD_NOTEBOOKS');
    });

    it('SET_COOKIE_ACTION', () => {
      expect(SET_COOKIE_ACTION).toBe('SET_NOTEBOOK_COOKIE');
    });

    it('OPEN_NOTEBOOK_ACTION', () => {
      expect(OPEN_NOTEBOOK_ACTION).toBe('OPEN_NOTEBOOK');
    });
  });
});
