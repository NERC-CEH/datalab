import crossStorage from 'cross-storage';
import minioService from './minioService';

const store = [];
let connectUrl;
const mockSuccessfulCrossStorage = class CrossStorageClient {
  constructor(url) {
    connectUrl = url;
  }

  onConnect() {
    return Promise.resolve();
  }

  set(key, value) {
    store.push({ key, value });
    return Promise.resolve();
  }
};

const mockFailedCrossStorage = class CrossStorageClient {
  onConnect() {
    return Promise.reject(new Error('error'));
  }
};

describe('minioService', () => {
  beforeEach(() => {
    store.length = 0;
    connectUrl = undefined;
  });

  describe('openStorage', () => {
    it('should connect to cross storage set token and open tab', () => {
      const url = 'http://localhost:3000/minio';
      const token = 'tokenValue';

      crossStorage.CrossStorageClient = mockSuccessfulCrossStorage;
      global.open = jest.fn();

      return minioService.openStorage(url, token)
        .then(() => {
          expect(connectUrl).toEqual('http://localhost:3000/connect');
          expect(store).toEqual([{ key: 'token', value: 'tokenValue' }]);
          expect(global.open).toBeCalledWith(url);
        });
    });

    it('should return a rejected promise if connect fails', () => {
      const url = 'http://localhost:3000/minio';
      const token = 'tokenValue';

      crossStorage.CrossStorageClient = mockFailedCrossStorage;

      return minioService.openStorage(url, token)
        .catch((error) => {
          expect(error).toBe('error');
        });
    });
  });
});
