import mockClient from './graphqlClient';
import notebookService from './notebookService';

jest.mock('./graphqlClient');

describe('notebookService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('loadNotebooks', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ notebooks: 'expectedValue' });

      return notebookService.loadNotebooks().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return notebookService.loadNotebooks().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('getUrl', () => {
    it('should build the correct query and return the url', () => {
      const data = { notebook: { redirectUrl: 'expectedUrl' } };
      const queryParams = { id: 'id' };
      mockClient.prepareSuccess(data);

      return notebookService.getUrl(queryParams.id).then((response) => {
        expect(response).toEqual(data.notebook);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(queryParams);
      });
    });

    it('should throw an error if no url is specified', () => {
      const data = { notebook: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return notebookService.getUrl().catch((error) => {
        expect(error.message).toEqual('Missing notebook URL');
      });
    });
  });

  describe('createNotebook', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { notebook: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return notebookService.createNotebook(data.notebook).then((response) => {
        expect(response).toEqual(data.notebook);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { notebook: { name: 'name' } };
      mockClient.prepareFailure('error');

      return notebookService.createNotebook(data.notebook).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('deleteNotebook', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { notebook: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return notebookService.deleteNotebook(data.notebook).then((response) => {
        expect(response).toEqual(data.notebook);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { notebook: { name: 'name' } };
      mockClient.prepareFailure('error');

      return notebookService.deleteNotebook(data.notebook).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
