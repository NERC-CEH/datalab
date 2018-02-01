import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator/check';
import { omit } from 'lodash';
import stackController from './stackController';
import stackManager from '../stacks/stackManager';

jest.mock('../stacks/stackManager');

const createStackMock = jest.fn();
stackManager.createStack = createStackMock;

let request;

describe('Notebook Controller', () => {
  beforeEach(() => createValidatedRequest());

  it('should process a valid request', () => {
    createStackMock.mockReturnValue(Promise.resolve());
    const response = httpMocks.createResponse();

    return stackController.createStack(request, response)
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
        param: 'type',
        msg: 'type must be specified',
      }],
    });

    const response = httpMocks.createResponse();

    stackController.createStack(invalidRequest, response);
    expect(response.statusCode).toBe(400);
    const expectedError = {
      errors: {
        type: {
          location: 'body',
          param: 'type',
          msg: 'type must be specified',
        },
      },
    };
    expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
  });

  it('should return 500 for failed request', () => {
    createStackMock.mockReturnValue(Promise.reject({ message: 'error' }));

    const response = httpMocks.createResponse();

    return stackController.createStack(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error creating stack: notebookId' }); // eslint-disable-line no-underscore-dangle
      });
  });

  it('should validate the name field exists', () => {
    const requestBody = createRequestBody();
    requestBody.name = '';
    return executeValidator(requestBody)
      .then(() => expectValidationError('name', 'Name must only use the characters a-z'));
  });

  it('should validate the name field is at least 4 characters', () => {
    const requestBody = createRequestBody();
    requestBody.name = 'abc';
    return executeValidator(requestBody)
      .then(() => expectValidationError('name', 'Name must be 4-12 characters long'));
  });

  it('should validate the volumeMount field exists', () => {
    const requestBody = omit(createRequestBody(), 'volumeMount');
    return executeValidator(requestBody)
      .then(() => expectValidationError('volumeMount', 'A Volume Mount must be specified'));
  });

  it('should validate the additional fields for rshiny', () => {
    const requestBody = createRequestBody();
    requestBody.type = 'rshiny';
    return executeValidator(requestBody).then(() => {
      expectValidationError('sourcePath', 'sourcePath must be specified for publication request');
      expectValidationError('isPublic', 'isPublic boolean must be specified for publication request');
    });
  });

  function executeValidator(body) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const validators = stackController.createStackValidator.map(createValidationPromise(request));
    return Promise.all(validators);
  }

  function expectValidationError(fieldName, expectedMessage) {
    expect(validationResult(request).mapped()[fieldName].msg).toEqual(expectedMessage);
  }
});

function createRequestBody() {
  return {
    datalabInfo: {
      name: 'testlab',
      domain: 'test-datalabs.nerc.ac.uk',
      volume: 'volume',
    },
    name: 'notebookId',
    type: 'jupyter',
    volumeMount: 'dataStore',
  };
}

function createValidatedRequest() {
  request = httpMocks.createRequest({
    method: 'GET',
    body: createRequestBody(),
  });

  const validators = stackController.createStackValidator.map(createValidationPromise(request));
  return Promise.all(validators);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
