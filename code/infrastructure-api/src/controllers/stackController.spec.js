import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator/check';
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
    return checkNameValidation(requestBody, 'Name must only use the characters a-z');
  });

  it('should validate the name field is at least 4 characters', () => {
    const requestBody = createRequestBody();
    requestBody.name = 'abc';
    return checkNameValidation(requestBody, 'Name must be 4-12 characters long');
  });

  function checkNameValidation(body, expectedMessage) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const validators = stackController.createStackValidator.map(createValidationPromise(request));
    return Promise.all(validators).then(() => {
      expect(validationResult(request).mapped().name.msg).toEqual(expectedMessage);
    });
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
