import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator';
import volumeController from './volumeController';
import volumeManager from '../stacks/volumeManager';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

jest.mock('../stacks/volumeManager');
jest.mock('../dataaccess/dataStorageRepository');

const createVolumeMock = jest.fn();
const listVolumeMock = jest.fn();
volumeManager.createVolume = createVolumeMock;
volumeManager.listVolumes = listVolumeMock;

const getAllActiveMock = jest.fn();
const getByIdMock = jest.fn();
const addUsersMock = jest.fn();
const removeUsersMock = jest.fn();
dataStorageRepository.getAllActive = getAllActiveMock;
dataStorageRepository.getById = getByIdMock;
dataStorageRepository.addUsers = addUsersMock;
dataStorageRepository.removeUsers = removeUsersMock;

let request;

const createNext = () => {
  let error;

  return {
    handler: (err) => { error = err; },
    getError: () => error,
    resetError: () => { error = undefined; },
  };
};
const next = createNext();

describe('Volume Controller', () => {
  beforeEach(() => { next.resetError(); });

  describe('create volume', () => {
    beforeEach(() => validatedCreateRequest());

    it('should process a valid request', () => {
      createVolumeMock.mockReturnValue(Promise.resolve());
      const response = httpMocks.createResponse();

      return volumeController.createVolume(request, response)
        .then(() => {
          expect(response.statusCode)
            .toBe(201);
        });
    });

    it('should return 500 for failed request', () => {
      createVolumeMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      return volumeController.createVolume(request, response, next.handler)
        .then(() => {
          expect(next.getError().message)
            .toEqual('Error creating volume: volumeName: error');
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

    it('should validate the volume size is greater than 5', () => {
      const requestBody = createRequestBody();
      requestBody.volumeSize = 4;
      return executeValidator(requestBody)
        .then(() => {
          expectValidationError('volumeSize', 'Volume Size must be an integer between 5 and 200');
        });
    });
  });

  describe('list volumes', () => {
    it('should return the volumes', async () => {
      listVolumeMock.mockReturnValue(Promise.resolve(['volume']));
      const response = httpMocks.createResponse();

      await volumeController.listVolumes(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(['volume']); // eslint-disable-line no-underscore-dangle
    });
  });

  describe('get volume by id', () => {
    it('should return the volume', async () => {
      getByIdMock.mockReturnValue(Promise.resolve('volume'));
      const response = httpMocks.createResponse();

      await volumeController.getById(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual('volume'); // eslint-disable-line no-underscore-dangle
    });

    it('should return 404 if the volume is not found', async () => {
      getByIdMock.mockReturnValue(Promise.resolve());
      const response = httpMocks.createResponse();

      await volumeController.getById(request, response);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('add users to volume', () => {
    it('should return the updated volume', async () => {
      await validatedUpdateUserRequest();
      addUsersMock.mockReturnValue(Promise.resolve('volume'));
      const response = httpMocks.createResponse();

      await volumeController.addUsers(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual('volume'); // eslint-disable-line no-underscore-dangle
    });

    it('should call next with an error if data access fails', async () => {
      await validatedUpdateUserRequest();
      addUsersMock.mockReturnValue(Promise.reject({ message: 'error' }));
      const response = httpMocks.createResponse();

      await volumeController.addUsers(request, response, next.handler);
      expect(next.getError().message).toEqual('Unable to add users to volume volumeName: error');
    });
  });

  describe('remove users from volume', () => {
    it('should return the updated volume', async () => {
      await validatedUpdateUserRequest();
      removeUsersMock.mockReturnValue(Promise.resolve('volume'));
      const response = httpMocks.createResponse();

      await volumeController.removeUsers(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual('volume'); // eslint-disable-line no-underscore-dangle
    });

    it('should call next with an error if data access fails', async () => {
      await validatedUpdateUserRequest();
      removeUsersMock.mockReturnValue(Promise.reject({ message: 'error' }));
      const response = httpMocks.createResponse();

      await volumeController.removeUsers(request, response, next.handler);
      expect(next.getError().message).toEqual('Unable to remove users from volume volumeName: error');
    });
  });

  describe('list active volumes', () => {
    it('should return the list of volumes', async () => {
      getAllActiveMock.mockReturnValue(Promise.resolve(['volume']));
      const response = httpMocks.createResponse();

      await volumeController.listActiveVolumes(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(['volume']); // eslint-disable-line no-underscore-dangle
    });
  });

  function executeValidator(body) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const response = httpMocks.createResponse();
    return volumeController.createVolumeValidator(request, response, () => {});
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
    },
    name: 'volumeName',
    projectKey: 'project',
    displayName: 'displayName',
    description: 'description',
    type: 1,
    volumeSize: '10',
  };
}

function validatedCreateRequest() {
  request = httpMocks.createRequest({
    method: 'GET',
    body: createRequestBody(),
  });

  return volumeController.createVolumeValidator(request, () => {}, () => {});
}

function validatedUpdateUserRequest() {
  request = httpMocks.createRequest({
    method: 'PUT',
    body: {
      name: 'volumeName',
      userIds: ['uid1', 'uid2'],
    },
  });

  return volumeController.updateVolumeUserValidator(request, () => {}, () => {});
}
