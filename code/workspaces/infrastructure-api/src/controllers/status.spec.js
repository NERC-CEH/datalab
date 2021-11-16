import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import status from './status';

jest.mock('mongoose');

describe('status controller', () => {
  beforeEach(() => {
    mongoose.connection = {
      readyState: 1,
    };
  });

  describe('get status', () => {
    it('should return "Development version" if version not set', () => {
      const response = httpMocks.createResponse();

      status.status(undefined, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify({ message: 'OK', version: 'development' }));
    });

    it('should return 500 if mongo is in a disconnected state', () => {
      const response = httpMocks.createResponse();

      mongoose.connection.readyState = 0;

      status.status(undefined, response);

      expect(response.statusCode).toEqual(500);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify({ message: 'Mongo down', version: 'development' }));
    });
  });
});
