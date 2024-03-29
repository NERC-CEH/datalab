import httpMocks from 'node-mocks-http';
import { validationResult } from 'express-validator';
import Promise from 'bluebird';
import stacksController from './stacksController';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('../dataaccess/stacksRepository');

const getAllByUserMock = jest.fn();
const getAllByProjectMock = jest.fn().mockReturnValue(Promise.resolve([]));
const getAllByCategoryMock = jest.fn().mockReturnValue(Promise.resolve([]));
const getAllByVolumeMountMock = jest.fn().mockReturnValue(Promise.resolve([]));
const getAllByVolumeMountAnonymisedMock = jest.fn().mockReturnValue(Promise.resolve([]));

stackRepository.default = {
  getAllByUser: getAllByUserMock,
  getAllByProject: getAllByProjectMock,
  getAllByCategory: getAllByCategoryMock,
  getAllByVolumeMount: getAllByVolumeMountMock,
  getAllByVolumeMountAnonymised: getAllByVolumeMountAnonymisedMock,
};

let request;

describe('Stacks controller', () => {
  describe('listByProject', () => {
    beforeEach(() => createValidatedRequest(
      { projectKey: 'expectedProject' },
      stacksController.withProjectValidator,
    ));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stacksController.listByProject(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 400 for invalid request', async () => {
      delete request.body.projectKey;
      await Promise.all(stacksController.withProjectValidator.map(validation => validation.run(request)));

      const response = httpMocks.createResponse();

      stacksController.listByCategory(request, response);
      expect(response.statusCode).toBe(400);
      const expectedError = {
        errors: {
          projectKey: {
            location: 'body',
            param: 'projectKey',
            msg: "project 'projectKey' must be specified in URL",
          },
        },
      };
      expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
    });

    it('should return 500 for failed request', () => {
      getAllByProjectMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stacksController.listByProject(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error retrieving by project for stacks' }); // eslint-disable-line no-underscore-dangle
        });
    });

    it('should validate the projectKey field exists', () => createValidatedRequest({}, stacksController.withProjectValidator)
      .then(() => expectValidationError('projectKey', "project 'projectKey' must be specified in URL")));
  });

  describe('listByCategory', () => {
    beforeEach(() => createValidatedRequest(
      { category: 'PUBLISH', projectKey: 'expectedProject' },
      stacksController.withCategoryValidator,
    ));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stacksController.listByCategory(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 400 for invalid request', async () => {
      delete request.body.category;
      await Promise.all(stacksController.withCategoryValidator.map(validation => validation.run(request)));

      const response = httpMocks.createResponse();

      stacksController.listByCategory(request, response);
      expect(response.statusCode).toBe(400);
      const expectedError = {
        errors: {
          category: {
            location: 'body',
            param: 'category',
            msg: 'category must match known type',
          },
        },
      };
      expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
    });

    it('should return 500 for failed request', () => {
      getAllByCategoryMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stacksController.listByCategory(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error retrieving by category for stacks' }); // eslint-disable-line no-underscore-dangle
        });
    });

    it('should validate the category field exists', () => createValidatedRequest({}, stacksController.withCategoryValidator)
      .then(() => expectValidationError('category', 'category must match known type')));
  });

  describe('listByMount', () => {
    beforeEach(() => createValidatedRequest(
      { mount: 'expectedMount', projectKey: 'expectedProject' },
      stacksController.withMountValidator,
    ));

    it('should process a valid request', () => {
      getAllByCategoryMock.mockReturnValue(Promise.resolve([]));
      const response = httpMocks.createResponse();

      return stacksController.listByMount(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 500 for failed request', () => {
      getAllByVolumeMountAnonymisedMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stacksController.listByMount(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error matching mount for stacks' }); // eslint-disable-line no-underscore-dangle
        });
    });

    it('should validate the category field exists', () => createValidatedRequest({}, stacksController.withMountValidator)
      .then(() => expectValidationError('mount', 'mount must be specified')));
  });
});

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

