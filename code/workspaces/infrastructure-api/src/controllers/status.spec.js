import httpMocks from 'node-mocks-http';
import status from './status';

describe('status controller', () => {
  describe('get status', () => {
    it('should return "Development version" if version not set', () => {
      const response = httpMocks.createResponse();

      status.status(undefined, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify({ message: 'OK', version: 'development' }));
    });
  });
});
