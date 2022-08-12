import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator';
import { omit } from 'lodash';
import stackController from './stackController';
import stackManager from '../stacks/stackManager';
import * as stackRepository from '../dataaccess/stacksRepository';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import * as shareStackManager from '../stacks/shareStackManager';

jest.mock('../stacks/stackManager');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../dataaccess/centralAssetRepoRepository', () => ({
  __esModule: true,
  default: { setLastAddedDateToNow: jest.fn() },
}));

const createStackMock = jest.fn().mockResolvedValue('expectedPayload');
const deleteStackMock = jest.fn().mockResolvedValue('expectedPayload');
const restartStackMock = jest.fn().mockResolvedValue('expectedPayload');
const updateShareStatusMock = jest.fn().mockResolvedValue('expectedPayload');
const updateMock = jest.fn().mockResolvedValue('expectedPayload');
const getOneByIdMock = jest.fn().mockResolvedValue('expectedPayload');
const getOneByNameMock = jest.fn().mockResolvedValue('expectedPayload');
const userCanDeleteStackMock = jest.fn().mockResolvedValue(true);
const userCanRestartStackMock = jest.fn().mockResolvedValue(true);
const updateAccessTimeToNowMock = jest.fn().mockResolvedValue('expectedPayload');
const resetAccessTimeMock = jest.fn().mockResolvedValue('expectedPayload');

stackManager.createStack = createStackMock;
stackManager.deleteStack = deleteStackMock;
stackManager.restartStack = restartStackMock;
stackRepository.default = {
  getOneById: getOneByIdMock,
  getOneByName: getOneByNameMock,
  userCanDeleteStack: userCanDeleteStackMock,
  userCanRestartStack: userCanRestartStackMock,
  updateShareStatus: updateShareStatusMock,
  update: updateMock,
  updateAccessTimeToNow: updateAccessTimeToNowMock,
  resetAccessTime: resetAccessTimeMock,
};

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

    it('should update linked assets', async () => {
      const responseMock = httpMocks.createResponse();
      await stackController.createStack(request, responseMock);
      expect(centralAssetRepoRepository.setLastAddedDateToNow).toHaveBeenCalledWith(request.body.assetIds);
    });

    it('should validate the name field exists', () => {
      const requestBody = mutationRequestBody();
      requestBody.name = '';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('name', 'Name must only use the characters a-z, 0-9'));
    });

    it('should validate the name field is at least 4 characters', () => {
      const requestBody = mutationRequestBody();
      requestBody.name = 'abc';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('name', 'Name must be 4-16 characters long'));
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

    it('should validate the shared field exists for notebooks', () => {
      const requestBody = omit(mutationRequestBody(), 'shared');
      requestBody.type = 'jupyterlab';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('shared', 'shared must be specified for notebooks'));
    });

    it('should validate the visible field exists for sites', () => {
      const requestBody = omit(mutationRequestBody(), 'visible');
      requestBody.type = 'rshiny';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('visible', 'visible must be specified for sites'));
    });

    it('should validate the version field', () => {
      const requestBody = mutationRequestBody();
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectNoValidationError());
    });

    it('should validate an invalid version field', () => {
      const requestBody = mutationRequestBody();
      requestBody.version = 'invalid-version';
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectValidationError('version', `Must be one of ${mutationRequestBody().version}.`));
    });

    it('should validate a request where version is omitted', () => {
      const requestBody = omit(mutationRequestBody(), 'version');
      return createValidatedRequest(requestBody, stackController.createStackValidator)
        .then(() => expectNoValidationError());
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
        })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should return 500 for failed request', () => {
      deleteStackMock.mockRejectedValue({ message: 'error' });

      const response = httpMocks.createResponse();

      return stackController.deleteStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error deleting stack: notebookId' }); // eslint-disable-line no-underscore-dangle
        })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should return 500 if user not allowed to delete stack', () => {
      userCanDeleteStackMock.mockResolvedValueOnce(false);

      const response = httpMocks.createResponse();

      return stackController.deleteStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'User cannot delete stack', message: 'Error deleting stack: notebookId' }); // eslint-disable-line no-underscore-dangle
        })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });
  });

  describe('updateStack', () => {
    const getRequestBody = () => ({
      projectKey: 'expectedProjectKey',
      name: 'abcd1234',
      shared: 'project',
      assetIds: ['test-update-asset-one', 'test-update-asset-two'],
    });

    const shareStackMock = jest.spyOn(shareStackManager, 'handleSharedChange');

    beforeEach(async () => {
      updateMock.mockClear();
      jest.clearAllMocks();
      await createValidatedRequest(
        getRequestBody(),
        stackController.updateStackValidator,
      );
    });

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.updateStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 500 for failed request', async () => {
      updateMock.mockRejectedValue({ message: 'error' });

      const response = httpMocks.createResponse();

      return stackController.updateStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ error: 'error', message: 'Error updating stack: abcd1234' }); // eslint-disable-line no-underscore-dangle
        })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should return 405 for disallowed request', async () => {
      const projectKey = 'projectKey';
      const name = 'stackname';
      const requestBody = {
        name,
        projectKey,
        shared: 'public',
      };

      await createValidatedRequest(requestBody, stackController.updateStackValidator);

      const response = httpMocks.createResponse();
      getOneByNameMock.mockResolvedValueOnce({ type: 'expected-type', category: 'ANALYSIS' });

      return stackController.updateStack(request, response)
        .then(() => {
          expect(response.statusCode).toBe(405);
          expect(response._getData()).toEqual({ error: 'Cannot set notebooks to Public' }); // eslint-disable-line no-underscore-dangle
          expect(shareStackMock).toHaveBeenCalledTimes(0);
        })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should update linked assets', async () => {
      const responseMock = httpMocks.createResponse();
      await stackController.updateStack(request, responseMock);
      expect(centralAssetRepoRepository.setLastAddedDateToNow).toHaveBeenCalledWith(request.body.assetIds);
    });

    it('should call to mount assets on stack', async () => {
      const responseMock = httpMocks.createResponse();
      getOneByNameMock.mockResolvedValueOnce({ type: 'expected-type' });

      await stackController.updateStack(request, responseMock);

      expect(stackManager.mountAssetsOnStack).toHaveBeenCalledWith({
        ...getRequestBody(), type: 'expected-type',
      });
    });

    describe('should validate the shared field value', () => {
      const validValues = ['private', 'project', 'public'];
      const invalidValue = 'invalidValue';

      const baseRequest = { projectKey: 'expectedProjectKey', name: 'abcd1234' };

      it(`validates ${validValues} as valid`, () => {
        validValues.forEach(async (value) => {
          await createValidatedRequest(
            { ...baseRequest, shared: value }, stackController.updateStackValidator,
          );
          expectNoValidationError();
        });
      });

      it(`validates ${invalidValue} as invalid`, async () => {
        await createValidatedRequest(
          { ...baseRequest, shared: invalidValue }, stackController.updateStackValidator,
        );
        expectValidationError(
          'shared',
          'Value of "shared" must be one of: "private", "project", "public".',
        );
      });

      it('allows null as an optional value', async () => {
        await createValidatedRequest(
          { ...baseRequest, shared: null }, stackController.updateStackValidator,
        );
        expectNoValidationError();
      });
    });

    it('should only call update with user updateable fields', async () => {
      const projectKey = 'projectKey';
      const name = 'stackname';
      const userUpdateableDetails = {
        displayName: 'Stack Display Name',
        description: 'Stack description',
        shared: 'private',
      };

      const requestBody = {
        projectKey,
        name,
        ...userUpdateableDetails,
        nonUserUpdateable: 'not updateable',
      };

      await createValidatedRequest(requestBody, stackController.updateStackValidator);
      const response = httpMocks.createResponse();
      await stackController.updateStack(request, response);

      expect(updateMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledWith(projectKey, request.user, name, userUpdateableDetails);
      expect(shareStackMock).toHaveBeenCalledTimes(1);
    });

    it('should not pass undefined or null values to update but should pass other falsy values', async () => {
      const projectKey = 'projectKey';
      const name = 'stackname';

      const requestBody = {
        projectKey,
        name,
        displayName: '',
        description: undefined,
        shared: null,
      };

      await createValidatedRequest(requestBody, stackController.updateStackValidator);
      const response = httpMocks.createResponse();
      await stackController.updateStack(request, response);

      expect(updateMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledWith(projectKey, request.user, name, { displayName: '' });
      expect(shareStackMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('restartStack', () => {
    beforeEach(() => createValidatedRequest({ projectKey: 'expectedProjectKey', name: 'notebookId', type: 'jupyter' }, stackController.restartStackValidator));

    it('should process a valid request', async () => {
      // Arrange
      const response = httpMocks.createResponse();
      restartStackMock.mockResolvedValue('success');

      // Act
      await stackController.restartStack(request, response);

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    it('should return 500 for failed request', async () => {
      // Arrange
      const response = httpMocks.createResponse();
      restartStackMock.mockRejectedValue({ message: 'error' });

      // Act
      await stackController.restartStack(request, response);

      // Assert
      expect(response.statusCode).toEqual(500);
      expect(response._getData()).toEqual({ error: 'error', message: 'Error restarting stack: notebookId' }); // eslint-disable-line no-underscore-dangle
    });

    it('should return 500 if user not allowed to restart stack', async () => {
      // Arrange
      const response = httpMocks.createResponse();
      userCanRestartStackMock.mockResolvedValueOnce(false);

      // Act
      await stackController.restartStack(request, response);

      // Assert
      expect(response.statusCode).toEqual(500);
      expect(response._getData()).toEqual({ error: 'User cannot restart stack.', message: 'Error restarting stack: notebookId' }); // eslint-disable-line no-underscore-dangle
    });
  });

  describe('scale stacks', () => {
    let response;
    beforeEach(async () => {
      await createValidatedRequest({ projectKey: 'expectedProjectKey', name: 'notebookId', type: 'jupyter' }, stackController.scaleStackValidator);

      response = httpMocks.createResponse();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('down', () => {
      it('should process a valid request', async () => {
        stackManager.scaleDownStack.mockResolvedValue('success');

        await stackController.scaleDownStack(request, response);

        expect(response.statusCode).toEqual(200);
      });

      it('should return 500 for failed request', async () => {
        stackManager.scaleDownStack.mockRejectedValue({ message: 'error' });

        await stackController.scaleDownStack(request, response);

        expect(response.statusCode).toEqual(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error scaling down stack: notebookId' }); // eslint-disable-line no-underscore-dangle
      });

      it('should return 500 if user not allowed to scale down stack', async () => {
        userCanRestartStackMock.mockResolvedValueOnce(false);

        await stackController.scaleDownStack(request, response);

        expect(response.statusCode).toEqual(500);
        expect(response._getData()).toEqual({ error: 'User cannot scale down stack.', message: 'Error scaling down stack: notebookId' }); // eslint-disable-line no-underscore-dangle
      });

      it('should reset the accessTime if scaled down', async () => {
        stackManager.scaleDownStack.mockResolvedValue('success');

        await stackController.scaleDownStack(request, response);

        expect(resetAccessTimeMock).toHaveBeenCalled();
      });
    });

    describe('up', () => {
      it('should process a valid request', async () => {
        stackManager.scaleUpStack.mockResolvedValue('success');

        await stackController.scaleUpStack(request, response);

        expect(response.statusCode).toEqual(200);
      });

      it('should return 500 for failed request', async () => {
        stackManager.scaleUpStack.mockRejectedValue({ message: 'error' });

        await stackController.scaleUpStack(request, response);

        expect(response.statusCode).toEqual(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error scaling up stack: notebookId' }); // eslint-disable-line no-underscore-dangle
      });

      it('should return 500 if user not allowed to scale up stack', async () => {
        userCanRestartStackMock.mockResolvedValueOnce(false);

        await stackController.scaleUpStack(request, response);

        expect(response.statusCode).toEqual(500);
        expect(response._getData()).toEqual({ error: 'User cannot scale up stack.', message: 'Error scaling up stack: notebookId' }); // eslint-disable-line no-underscore-dangle
      });

      it('should set the accessTime if scaled up', async () => {
        stackManager.scaleUpStack.mockResolvedValue('success');

        await stackController.scaleUpStack(request, response);

        expect(updateAccessTimeToNowMock).toHaveBeenCalled();
      });
    });
  });

  describe('getOneById', () => {
    beforeEach(() => createValidatedRequest({ projectKey: 'expectedProjectKey', id: 'abcd1234' }, stackController.withIdValidator));

    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      // Doc key is required in the follow return to allow it to passthrough the renameIdHandler
      getOneByIdMock.mockReturnValue(Promise.resolve({ _id: '123', projectKey: 'expectedProjectKey', _doc: {} }));
      return stackController.getOneById(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 500 for failed request', async () => {
      getOneByIdMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      try {
        await stackController.getOneById(request, response);
        expect(true).toBe(false);
      } catch (err) {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error matching ID for stack' }); // eslint-disable-line no-underscore-dangle
      }
    });

    it('should validate the id field exists', () => createValidatedRequest({}, stackController.withIdValidator)
      .then(() => expectValidationError('id', 'id must be specified')));
  });

  describe('getOneByName', () => {
    beforeEach(() => createValidatedRequest(
      { name: 'expectedName', projectKey: 'expectedProject' },
      stackController.withNameValidator,
    ));

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

  describe('updateAccessTime', () => {
    beforeEach(() => {
      request = { projectKey: 'projectKey', name: 'name' };
    });
    it('should process a valid request', () => {
      const response = httpMocks.createResponse();

      return stackController.updateAccessTime(request, response)
        .catch(() => {
          expect(response.statusCode).toBe(204);
        });
    });

    it('should return 500 for failed request', () => {
      updateAccessTimeToNowMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return stackController.updateAccessTime(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
        });
    });
  });
});

function mutationRequestBody() {
  return {
    projectKey: 'project',
    name: 'notebookId',
    displayName: 'notebookDisplayName',
    type: 'jupyter',
    volumeMount: 'dataStore',
    description: 'long description',
    shared: 'private',
    visible: 'private',
    version: 'Dask 2021.6/Spark 3.1.2',
    assetIds: ['test-asset-one', 'test-asset-two'],
  };
}

function createValidatedRequest(body, validators) {
  request = httpMocks.createRequest({
    method: 'GET',
    body,
    headers: {
      authorization: 'token',
    },
  });

  const vals = validators.map(createValidationPromise(request));
  return Promise.all(vals);
}

function expectValidationError(fieldName, expectedMessage) {
  expect(validationResult(request).mapped()[fieldName].msg).toEqual(expectedMessage);
}

function expectNoValidationError() {
  expect(validationResult(request).errors.length).toBe(0);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
