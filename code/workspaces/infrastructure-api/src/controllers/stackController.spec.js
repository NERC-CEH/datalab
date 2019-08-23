import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator';
import { omit } from 'lodash';
import stackController from './stackController';
import stackManager from '../stacks/stackManager';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('../stacks/stackManager');
jest.mock('../dataaccess/stacksRepository');

const createStackMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
const deleteStackMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
const getOneByIdMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
const getOneByNameMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
stackManager.createStack = createStackMock;
stackManager.deleteStack = deleteStackMock;
stackRepository.default = { getOneById: getOneByIdMock, getOneByName: getOneByNameMock };

let request;

describe('Stack Controller', () => {
  describe('createStack', () => {
    beforeEach(() => createValidatedRequest(mutationRequestBody(), stackController.createStackValidator));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.createStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(201);
        });
    });

    it('should return 400 for invalid request', async () => {
      delete request.body.type;
      await Promise.all(stackController.createStackValidator.map(validation => validation.run(request)));

      const response = httpMocks.createResponse();

      stackController.createStack(request, response);
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
      const requestBody = mutationRequestBody();
      requestBody.name = '';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('name', 'Name must only use the characters a-z'));
    });

    it('should validate the name field is at least 4 characters', () => {
      const requestBody = mutationRequestBody();
      requestBody.name = 'abc';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('name', 'Name must be 4-12 characters long'));
    });

    it('should validate the datalabInfo.domain field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'datalabInfo.domain');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('datalabInfo.domain', 'datalabInfo.domain must be specified'));
    });

    it('should validate the datalabInfo.name field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'datalabInfo.name');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('datalabInfo.name', 'datalabInfo.name must be specified'));
    });

    it('should validate the type field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'type');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('type', 'type must be specified'));
    });

    it('should validate the description field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'description');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('description', 'description must be specified'));
    });

    it('should validate the displayName field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'displayName');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('displayName', 'displayName must be specified'));
    });

    it('should validate the volumeMount field exists', () => {
      const requestBody = omit(mutationRequestBody(), 'volumeMount');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('volumeMount', 'volumeMount must be specified'));
    });

    it('should validate the additional fields for rshiny', () => {
      const requestBody = mutationRequestBody();
      requestBody.type = 'rshiny';
      return createValidatedRequest(requestBody, stackController.createStackValidator).then(() => {
        expectValidationError('sourcePath', 'sourcePath must be specified for publication request');
        expectValidationError('isPublic', 'isPublic boolean must be specified for publication request');
      });
    });
  });

  describe('deleteStack', () => {
    beforeEach(() => createValidatedRequest(mutationRequestBody(), stackController.deleteStackValidator));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.deleteStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(204);
        });
    });

    it('should return 500 for failed request', () => {
      deleteStackMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stackController.deleteStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error deleting stack: notebookId' }); // eslint-disable-line no-underscore-dangle
        });
    });
  });

  describe('getOneById', () => {
    beforeEach(() => createValidatedRequest({ id: 'abcd1234' }, stackController.withIdValidator));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.getOneById(request, response)
        .catch(() => {
          expect(response.statusCode).toBe(204);
        });
    });

    it('should return 500 for failed request', () => {
      getOneByIdMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stackController.getOneById(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error matching ID for stack' }); // eslint-disable-line no-underscore-dangle
        });
    });

    it('should validate the id field exists', () => createValidatedRequest({}, stackController.withIdValidator)
      .then(() => expectValidationError('id', 'id must be specified')));
  });

  describe('getOneByName', () => {
    beforeEach(() => createValidatedRequest({ name: 'expectedName' }, stackController.withNameValidator));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.getOneByName(request, response)
        .catch(() => {
          expect(response.statusCode).toBe(204);
        });
    });

    it('should return 500 for failed request', () => {
      getOneByNameMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stackController.getOneByName(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error matching Name for stack' }); // eslint-disable-line no-underscore-dangle
        });
    });
  });
});

function mutationRequestBody() {
  return {
    datalabInfo: {
      name: 'testlab',
      domain: 'test-datalabs.nerc.ac.uk',
    },
    name: 'notebookId',
    displayName: 'notebookDisplayName',
    type: 'jupyter',
    volumeMount: 'dataStore',
    description: 'long description',
  };
}

function createValidatedRequest(body, validators) {
  request = httpMocks.createRequest({
    method: 'GET',
    body,
  });

  const vals = validators.map(createValidationPromise(request));
  return Promise.all(vals);
}

function expectValidationError(fieldName, expectedMessage) {
  expect(validationResult(request).mapped()[fieldName].msg).toEqual(expectedMessage);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
