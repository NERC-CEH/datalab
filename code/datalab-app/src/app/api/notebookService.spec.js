import axios from 'axios';
import notebookService from './notebookService';

jest.mock('axios');

describe('notebookService', () => {
  beforeEach(() => jest.resetAllMocks());

  const createResolvedResponse = data => Promise.resolve({ data: { data } });

  const createRejectedResponse = error => Promise.reject(error);

  describe('loadNotebooks', () => {
    it('should submit a post request for the data storage and unpack response', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse({ notebooks: 'expectedNotebooksPayload' }));
      axios.post = postMock;

      // Act
      const output = notebookService.loadNotebooks();

      // Assert
      output.then(response => expect(response).toBe('expectedNotebooksPayload'));
    });

    it('call submits post request with correct body', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse());
      axios.post = postMock;

      // Act
      notebookService.loadNotebooks();

      // Assert
      expect(postMock.mock.calls).toMatchSnapshot();
    });

    it('should throw error if post fails', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createRejectedResponse('expectedBadRequest'));
      axios.post = postMock;

      // Act
      const output = notebookService.loadNotebooks();

      // Assert
      output.catch(response => expect(response).toBe('expectedBadRequest'));
    });
  });
});
