import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import { validationResult } from 'express-validator';
import volumeController from './volumeController';
import volumeManager from '../stacks/volumeManager';

jest.mock('../stacks/volumeManager');

const createVolumeMock = jest.fn();
volumeManager.createVolume = createVolumeMock;

let request;

describe('Volume Controller', () => {
  beforeEach(() => createValidatedRequest());

  it('should process a valid request', () => {
    createVolumeMock.mockReturnValue(Promise.resolve());
    const response = httpMocks.createResponse();

    return volumeController.createVolume(request, response)
      .then(() => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should return 400 for invalid request', async () => {
    delete request.body.name;
    await Promise.all(volumeController.createVolumeValidator.map(validation => validation.run(request)));

    const response = httpMocks.createResponse();

    volumeController.createVolume(request, response);
    expect(response.statusCode).toBe(400);
    const expectedError = {
      errors: {
        name: {
          location: 'body',
          param: 'name',
          msg: 'Name must be specified',
        },
      },
    };
    expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
  });

  it('should return 500 for failed request', () => {
    createVolumeMock.mockReturnValue(Promise.reject({ message: 'error' }));

    const response = httpMocks.createResponse();

    return volumeController.createVolume(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error creating volume: volumeName' }); // eslint-disable-line no-underscore-dangle
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
    return executeValidator(requestBody).then(() => {
      expectValidationError('volumeSize', 'Volume Size must be an integer between 5 and 200');
    });
  });

  function executeValidator(body) {
    request = httpMocks.createRequest({ method: 'GET', body });
    const validators = volumeController.createVolumeValidator.map(createValidationPromise(request));
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
    },
    name: 'volumeName',
    projectKey: 'project',
    volumeSize: '10',
  };
}

function createValidatedRequest() {
  request = httpMocks.createRequest({
    method: 'GET',
    body: createRequestBody(),
  });

  const validators = volumeController.createVolumeValidator.map(createValidationPromise(request));
  return Promise.all(validators);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
