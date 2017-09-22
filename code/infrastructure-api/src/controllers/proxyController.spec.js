import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import proxyController from './proxyController';
import proxyRouteApi from '../kong/proxyRouteApi';

jest.mock('../kong/proxyRouteApi');

const createOrUpdateRouteMock = jest.fn();
const deleteRouteMock = jest.fn();
proxyRouteApi.createOrUpdateRoute = createOrUpdateRouteMock;
proxyRouteApi.deleteRoute = deleteRouteMock;

let request;

describe('Proxy Route Controller', () => {
  beforeEach(() => createValidatedRequest(proxyController.createProxyRouteValidator, 'GET', createRequestBody()));

  it('should process a valid request', () => {
    createOrUpdateRouteMock.mockReturnValue(Promise.resolve());
    const response = httpMocks.createResponse();

    return proxyController.createRoute(request, response)
      .then(() => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should return 400 for invalid request', () => {
    const bodyValidationError = {
      location: 'body',
      param: 'port',
      msg: 'port must be specified',
    };
    const invalidRequest = httpMocks.createRequest({
      method: 'GET',
      body: createRequestBody(),
      _validationErrors: [bodyValidationError],
    });

    const response = httpMocks.createResponse();

    proxyController.createRoute(invalidRequest, response);
    expect(response.statusCode).toBe(400);
    const expectedError = {
      errors: { port: bodyValidationError },
    };
    expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
  });

  it('should return 500 for failed request', () => {
    createOrUpdateRouteMock.mockReturnValue(Promise.reject({ message: 'error' }));

    const response = httpMocks.createResponse();

    return proxyController.createRoute(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error creating route: service' }); // eslint-disable-line no-underscore-dangle
      });
  });
});

describe('Proxy route deletion controller', () => {
  beforeEach(() => createValidatedRequest(proxyController.deleteProxyRouteValidator, 'DELETE', deleteRequestBody()));

  it('should process a valid request', () => {
    deleteRouteMock.mockReturnValue(Promise.resolve());
    const response = httpMocks.createResponse();

    return proxyController.deleteRoute(request, response)
      .then(() => {
        expect(response.statusCode).toBe(204);
      });
  });

  it('should return 400 for invalid request', () => {
    const bodyValidationError = {
      location: 'body',
      param: 'name',
      msg: 'name must be specified',
    };
    const invalidRequest = httpMocks.createRequest({
      method: 'DELETE',
      body: deleteRequestBody(),
      _validationErrors: [bodyValidationError],
    });

    const response = httpMocks.createResponse();

    proxyController.deleteRoute(invalidRequest, response);
    expect(response.statusCode).toBe(400);
    const expectedError = {
      errors: { name: bodyValidationError },
    };
    expect(JSON.parse(response._getData())).toEqual(expectedError); // eslint-disable-line no-underscore-dangle
  });

  it('should return 500 for failed request', () => {
    deleteRouteMock.mockReturnValue(Promise.reject({ message: 'error' }));

    const response = httpMocks.createResponse();

    return proxyController.deleteRoute(request, response)
      .then(() => {
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual({ error: 'error', message: 'Error deleting route: service' }); // eslint-disable-line no-underscore-dangle
      });
  });
});

function createRequestBody() {
  return {
    name: 'service',
    datalab: {
      name: 'testlab',
      domain: 'test-datalabs.nerc.ac.uk',
    },
    port: 32456,
  };
}

function deleteRequestBody() {
  return {
    name: 'service',
    datalab: {
      name: 'testlab',
      domain: 'test-datalabs.nerc.ac.uk',
    },
  };
}

function createValidatedRequest(validator, method, body) {
  request = httpMocks.createRequest({ method, body });

  const validators = validator.map(createValidationPromise(request));
  return Promise.all(validators);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
