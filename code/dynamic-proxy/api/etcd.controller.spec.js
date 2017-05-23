import httpMocks from 'node-mocks-http';
import * as controller from './etcd.controller';
import etcdService from '../services/etcd.service.instance';

jest.mock('../services/etcd.service');

const mockGetRoutes = jest.fn();
const mockAddRoute = jest.fn();
const mockDeleteRoute = jest.fn();
const mockDeleteAllRoutes = jest.fn();

etcdService.getRoutes = mockGetRoutes;
etcdService.addRoute = mockAddRoute;
etcdService.deleteRoute = mockDeleteRoute;
etcdService.deleteAllRoutes = mockDeleteAllRoutes;

let response;

beforeEach(() => {
  response = httpMocks.createResponse();
  jest.resetAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('list routes returns routes and 200 if successful', () => {
  const returnedRoutes = [{ source: 'source', target: 'target' }];

  mockGetRoutes.mockReturnValue(Promise.resolve(returnedRoutes));
  const request = httpMocks.createRequest();

  controller.listRoutes(request, response)
    .then(() => {
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toBe(returnedRoutes); // eslint-disable-line no-underscore-dangle
    });
});

test('list routes returns routes a 500 if look up fails', () => {
  mockGetRoutes.mockReturnValueOnce(Promise.reject());
  const request = httpMocks.createRequest();

  controller.listRoutes(request, response).then(() => {
    expect(response.statusCode).toBe(500);
    expect(response._getData()).toEqual({ message: 'Error loading routes' }); // eslint-disable-line no-underscore-dangle
  });
});

test('add route returns 201 if successful', () => {
  const returnedData = [{ message: 'Content from ETCD' }];

  mockAddRoute.mockReturnValue(Promise.resolve(returnedData));

  controller.addRoute(createRequest(), response)
    .then(() => {
      expect(response.statusCode).toBe(201);
      expect(response._getData()).toBe(returnedData); // eslint-disable-line no-underscore-dangle
    });
});

test('add route returns 500 if add fails', () => {
  mockAddRoute.mockReturnValueOnce(Promise.reject('error'));

  controller.addRoute(createRequest(), response).then(() => {
    expect(response.statusCode).toBe(500);
    expect(response._getData()).toEqual({ message: 'Error adding a route: error' }); // eslint-disable-line no-underscore-dangle
  });
});

test('delete route returns 200 if successful', () => {
  const returnedData = [{ message: 'Content from ETCD' }];

  mockDeleteRoute.mockReturnValue(Promise.resolve(returnedData));

  controller.deleteRoute(createRequest(), response)
    .then(() => {
      expect(mockDeleteRoute).toBeCalledWith('source');
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toBe(returnedData); // eslint-disable-line no-underscore-dangle
    });
});

test('delete route returns 500 if delete fails', () => {
  mockDeleteRoute.mockReturnValueOnce(Promise.reject('error'));

  controller.deleteRoute(createRequest(), response).then(() => {
    expect(mockDeleteRoute).toBeCalledWith('source');
    expect(response.statusCode).toBe(500);
    expect(response._getData()).toEqual({ message: 'Error deleting route source: error' }); // eslint-disable-line no-underscore-dangle
  });
});

test('delete all routes returns 200 if successful', () => {
  const returnedData = [{ message: 'Content from ETCD' }];

  mockDeleteAllRoutes.mockReturnValue(Promise.resolve(returnedData));
  const request = httpMocks.createRequest();

  controller.deleteAllRoutes(request, response)
    .then(() => {
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toBe(returnedData); // eslint-disable-line no-underscore-dangle
    });
});

test('delete all routes returns 500 if delete fails', () => {
  mockDeleteAllRoutes.mockReturnValueOnce(Promise.reject('error'));
  const request = httpMocks.createRequest();

  controller.deleteAllRoutes(request, response).then(() => {
    expect(response.statusCode).toBe(500);
    expect(response._getData()).toEqual({ message: 'Error deleting all routes: error' }); // eslint-disable-line no-underscore-dangle
  });
});

function createRequest() {
  return httpMocks.createRequest({
    body: {
      source: 'source',
      target: 'target',
    },
  });
}
