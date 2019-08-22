import httpMocks from 'node-mocks-http';
import status from './status';
import version from '../version';

jest.mock('../version');

describe('status controller', () => {
  describe('get status', () => {
    it('should return "Development version" if version not set', () => {
      version.versionString = undefined;
      const response = httpMocks.createResponse();

      status.status(undefined, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify({ message: 'OK', versionString: 'Development build' }));
    });

    it('should return version number if version set', () => {
      version.versionString = '1.0.0';
      const response = httpMocks.createResponse();

      status.status(undefined, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual(JSON.stringify({ message: 'OK', versionString: '1.0.0' }));
    });
  });
});
