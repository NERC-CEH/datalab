import { ApolloError } from 'apollo-server';
import { axiosErrorHandler, wrapWithAxiosErrorWrapper } from './errorHandlers';

const friendlyMessage = 'Friendly message';
const errorMessage = 'Error message';

describe('errorHandlers', () => {
  describe('axiosErrorHandler', () => {
    it('handles if error in response.data.message', () => {
      // Arrange
      const error = { response: { data: { message: errorMessage } } };

      // Act/Assert
      expect(() => axiosErrorHandler(friendlyMessage)(error)).toThrow(new Error(`${friendlyMessage} ${errorMessage}`));
    });

    it('handles if just returns error message', () => {
      // Act/Assert
      expect(() => axiosErrorHandler(friendlyMessage)(errorMessage)).toThrow(new Error(`${friendlyMessage} ${errorMessage}`));
    });
  });

  describe('wrapWithAxiosErrorWrapper', () => {
    it('resolves if does not throw', async () => {
      // Arrange
      const fn = async () => Promise.resolve('No error');
      const wrappedFn = wrapWithAxiosErrorWrapper(friendlyMessage, fn);

      // Act/Assert
      expect(wrappedFn()).resolves.toEqual('No error');
    });

    it('handles unauthorised 401', async () => {
      // Arrange
      const fn = async () => Promise.reject({ response: { status: 401, data: { errors: [errorMessage] } } });
      const wrappedFn = wrapWithAxiosErrorWrapper(friendlyMessage, fn);

      // Act/Assert
      expect(wrappedFn()).rejects.toEqual(new ApolloError(errorMessage, 'UNAUTHORISED'));
    });

    it('handles unauthorised 403', async () => {
      // Arrange
      const fn = async () => Promise.reject({ response: { status: 403, data: { errors: [errorMessage] } } });
      const wrappedFn = wrapWithAxiosErrorWrapper(friendlyMessage, fn);

      // Act/Assert
      expect(wrappedFn()).rejects.toEqual(new ApolloError(errorMessage, 'UNAUTHORISED'));
    });

    it('handles normal error', async () => {
      // Arrange
      const fn = async () => Promise.reject({ response: { data: { message: errorMessage } } });
      const wrappedFn = wrapWithAxiosErrorWrapper(friendlyMessage, fn);

      // Act/Assert
      expect(wrappedFn()).rejects.toEqual(new Error(`${friendlyMessage} ${errorMessage}`));
    });
  });
});
