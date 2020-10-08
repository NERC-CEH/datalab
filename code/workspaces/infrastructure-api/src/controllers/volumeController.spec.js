import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator';
import volumeController from './volumeController';
import volumeManager from '../stacks/volumeManager';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

jest.mock('../stacks/volumeManager');
jest.mock('../dataaccess/dataStorageRepository');

const createVolumeMock = jest.fn();
const deleteVolumeMock = jest.fn();
const listVolumeMock = jest.fn();
volumeManager.createVolume = createVolumeMock;
volumeManager.deleteVolume = deleteVolumeMock;
volumeManager.listVolumes = listVolumeMock;

const getAllProjectActiveMock = jest.fn();
const getByIdMock = jest.fn();
const addUsersMock = jest.fn();
const removeUsersMock = jest.fn();
const updateMock = jest.fn();
dataStorageRepository.getAllProjectActive = getAllProjectActiveMock;
dataStorageRepository.getById = getByIdMock;
dataStorageRepository.addUsers = addUsersMock;
dataStorageRepository.removeUsers = removeUsersMock;
dataStorageRepository.update = updateMock;

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

    it('should process a valid request', async () => {
      createVolumeMock.mockReturnValue(Promise.resolve());
      const response = httpMocks.createResponse();

      await volumeController.createVolume(request, response);
      expect(response.statusCode).toBe(201);
    });

    it('should return 500 for failed request', async () => {
      createVolumeMock.mockReturnValue(Promise.reject({ message: 'error' }));

      const response = httpMocks.createResponse();

      await volumeController.createVolume(request, response, next.handler);
      expect(next.getError().message).toEqual('Error creating volume: volumeName: error');
    });

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeCreateValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
    });

    it('should validate the name field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.name = '';
      await executeCreateValidator(requestBody);
      expectValidationError('name', 'name must have content');
    });

    it('should validate the name field is at least 4 characters', async () => {
      const requestBody = createRequestBody();
      requestBody.name = 'abc';
      await executeCreateValidator(requestBody);
      expectValidationError('name', 'Name must be 4-16 characters long');
    });

    it('should validate the volume size is greater than 5', async () => {
      const requestBody = createRequestBody();
      requestBody.volumeSize = 4;
      await executeCreateValidator(requestBody);
      expectValidationError('volumeSize', 'Volume Size must be an integer between 5 and 200');
    });

    it('should validate the type is between 1 and 2', async () => {
      const requestBody = createRequestBody();
      requestBody.type = 0;
      await executeCreateValidator(requestBody);
      expectValidationError('type', 'Type must be 1 (glusterfs) or 2 (nfs)');
    });
  });

  describe('delete volume', () => {
    beforeEach(() => validatedDeleteRequest());

    it('should process a valid request', async () => {
      deleteVolumeMock.mockReturnValue(Promise.resolve());
      const response = httpMocks.createResponse();

      await volumeController.deleteVolume(request, response);
      expect(response.statusCode).toBe(204);
    });

    it('should return 500 for failed request', async () => {
      deleteVolumeMock.mockReturnValue(Promise.reject({ message: 'error' }));
      const response = httpMocks.createResponse();

      await volumeController.deleteVolume(request, response, next.handler);
      expect(next.getError().message).toEqual('Error deleting project: project99 volume: volumeName: error');
    });

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeDeleteValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
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

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeIdValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
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
      expect(next.getError().message).toEqual('Unable to add users to project project99 volume volumeName: error');
    });

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeUpdateUserValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
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
      expect(next.getError().message).toEqual('Unable to remove users from project project99 volume volumeName: error');
    });

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeUpdateUserValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
    });
  });

  describe('list active volumes', () => {
    it('should return the list of volumes', async () => {
      getAllProjectActiveMock.mockReturnValue(Promise.resolve(['volume']));
      const response = httpMocks.createResponse();

      await volumeController.listProjectActiveVolumes(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(['volume']); // eslint-disable-line no-underscore-dangle
    });

    it('should validate the projectKey field exists', async () => {
      const requestBody = createRequestBody();
      requestBody.projectKey = '';
      await executeProjectKeyValidator(requestBody);
      expectValidationError('projectKey', 'projectKey must have content');
    });
  });

  function executeCreateValidator(body) {
    request = httpMocks.createRequest({ method: 'POST', body });
    const response = httpMocks.createResponse();
    return volumeController.createVolumeValidator(request, response, () => { });
  }

  function executeDeleteValidator(body) {
    request = httpMocks.createRequest({ method: 'DELETE', body });
    const response = httpMocks.createResponse();
    return volumeController.deleteVolumeValidator(request, response, () => { });
  }

  function executeIdValidator(body) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const response = httpMocks.createResponse();
    return volumeController.getByIdValidator(request, response, () => { });
  }

  function executeUpdateUserValidator(body) {
    request = httpMocks.createRequest({ method: 'PUT', body });
    const response = httpMocks.createResponse();
    return volumeController.updateVolumeUserValidator(request, response, () => { });
  }

  function executeProjectKeyValidator(body) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const response = httpMocks.createResponse();
    return volumeController.projectKeyValidator(request, response, () => { });
  }

  function expectValidationError(fieldName, expectedMessage) {
    const fieldNameResult = validationResult(request).mapped()[fieldName];
    expect(fieldNameResult).toBeDefined();
    expect(fieldNameResult.msg).toEqual(expectedMessage);
  }
});

function createRequestBody() {
  return {
    datalabInfo: {
      name: 'testlab',
      domain: 'test-datalabs.nerc.ac.uk',
    },
    name: 'volumeName',
    projectKey: 'project99',
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

  return volumeController.createVolumeValidator(request, () => { }, () => { });
}

function validatedDeleteRequest() {
  request = httpMocks.createRequest({
    method: 'DELETE',
    body: {
      projectKey: 'project99',
      name: 'volumeName',
    },
  });

  return volumeController.deleteVolumeValidator(request, () => { }, () => { });
}

function validatedUpdateUserRequest() {
  request = httpMocks.createRequest({
    method: 'PUT',
    body: {
      projectKey: 'project99',
      name: 'volumeName',
      userIds: ['uid1', 'uid2'],
    },
  });

  return volumeController.updateVolumeUserValidator(request, () => { }, () => { });
}
