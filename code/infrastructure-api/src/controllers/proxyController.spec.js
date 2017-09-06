import httpMocks from 'node-mocks-http';
import Promise from 'bluebird';
import proxyController from './proxyController';
import proxyRouteApi from '../kong/proxyRouteApi';

jest.mock('../kong/proxyRouteApi');

const createOrUpdateRouteMock = jest.fn();
proxyRouteApi.createOrUpdateRoute = createOrUpdateRouteMock;

let request;

describe('Proxy Route Controller', () => {
  beforeEach(() => createValidatedRequest());

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

function createValidatedRequest() {
  request = httpMocks.createRequest({
    method: 'GET',
    body: createRequestBody(),
  });

  const validators = proxyController.createProxyRouteValidator.map(createValidationPromise(request));
  return Promise.all(validators);
}

const createValidationPromise = req => validator => new Promise((resolve) => { validator(req, null, resolve); });
