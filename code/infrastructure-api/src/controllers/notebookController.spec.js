import httpMocks from 'node-mocks-http';
import notebookController from './notebookController';
import notebookManager from '../notebooks/notebookManager';

jest.mock('../notebooks/notebookManager');

const createNotebookMock = jest.fn();
notebookManager.createNotebook = createNotebookMock;

describe('Notebook Controller', () => {
  it('should process a valid request', () => {
    createNotebookMock.mockReturnValue(Promise.resolve());

    const request = httpMocks.createRequest({
      method: 'GET',
      body: createRequestBody(),
      _validationErrors: [], // No errors from middleware
    });

    const response = httpMocks.createResponse();

    return notebookController.createNotebook(request, response)
      .then(() => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should return 400 for invalid request', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      body: createRequestBody(),
      _validationErrors: [{
        location: 'body',
        param: 'notebookType',
        msg: 'notebookType must be specified',
      }],
    });

    const response = httpMocks.createResponse();

    notebookController.createNotebook(request, response);
    expect(response.statusCode).toBe(400);
    const expectedError = {
      errors: {
        notebookType: {
          location: 'body',
          param: 'notebookType',
          msg: 'notebookType must be specified',
        },
      },
    };
    expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
  });

  it('should return 500 for failed request', () => {
    createNotebookMock.mockReturnValue(Promise.reject('error'));
    const request = httpMocks.createRequest({
      method: 'GET',
      body: createRequestBody(),
      _validationErrors: [],
    });

    const response = httpMocks.createResponse();

    notebookController.createNotebook(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error' }); // eslint-disable-line no-underscore-dangle
      });
  });
});

function createRequestBody() {
  return {
    datalabName: 'datalab',
    notebookId: 'notebookId',
    notebookType: 'jupyter',
  };
}
