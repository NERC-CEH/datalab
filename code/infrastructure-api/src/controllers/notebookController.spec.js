import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import notebookController from './notebookController';
import notebookManager from '../notebooks/notebookManager';

jest.mock('../notebooks/notebookManager');

const createNotebookMock = jest.fn();
notebookManager.createNotebook = createNotebookMock;

let request;

describe('Notebook Controller', () => {
  beforeEach(() => createValidatedRequest());

  it('should process a valid request', () => {
    createNotebookMock.mockReturnValue(Promise.resolve());
    const response = httpMocks.createResponse();

    return notebookController.createNotebook(request, response)
      .then(() => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should return 400 for invalid request', () => {
    const invalidRequest = httpMocks.createRequest({
      method: 'GET',
      body: createRequestBody(),
      _validationErrors: [{
        location: 'body',
        param: 'notebookType',
        msg: 'notebookType must be specified',
      }],
    });

    const response = httpMocks.createResponse();

    notebookController.createNotebook(invalidRequest, response);
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
    createNotebookMock.mockReturnValue(Promise.reject({ message: 'error' }));

    const response = httpMocks.createResponse();

    return notebookController.createNotebook(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error creating notebook notebookId' }); // eslint-disable-line no-underscore-dangle
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

function createValidatedRequest() {
  request = httpMocks.createRequest({
    method: 'GET',
    body: createRequestBody(),
  });

  const validators = notebookController.createNotebookValidator.map(createValidationPromise(request));
  return Promise.all(validators);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
