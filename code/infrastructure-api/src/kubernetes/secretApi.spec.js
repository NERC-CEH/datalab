import moxios from 'moxios';
import config from '../config/config';
import secretApi from './secretApi';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const SECRET_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/secrets`;
const SECRET_NAME = 'test';
describe('Kubernetes Secret API', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('createOrUpdate secret', () => {
    it('should CREATE if secret does not exist', () => {
      const secret = createSecret();
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 404,
      });

      moxios.stubRequest(SECRET_URL, {
        status: 204,
      });

      return secretApi.createOrUpdateSecret('test', 'testvalue')
        .then((response) => {
          expect(JSON.parse(response.config.data)).toEqual(secret);
        });
    });

    it('should UPDATE if secret exists', () => {
      const secret = createSecret();
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 200,
        response: secret,
      });

      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 204,
      });

      return secretApi.createOrUpdateSecret('test', 'testvalue')
        .then((response) => {
          expect(JSON.parse(response.config.data)).toEqual(secret);
        });
    });
  });

  describe('get secret', () => {
    it('should return the secret if it exists', () => {
      const secret = createSecret();
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 200,
        response: secret,
      });

      return secretApi.getSecret('test')
        .then((response) => {
          expect(response).toEqual(secret);
        });
    });

    it('should return undefined it the secret does not exist', () => {
      const secret = createSecret();
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 404,
        response: secret,
      });

      return secretApi.getSecret('test')
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create secret', () => {
    it('should POST payload to bare resource URL', () => {
      const secret = createSecret();
      moxios.stubRequest(SECRET_URL, {
        status: 204,
        response: secret,
      });

      return secretApi.createSecret('test', 'testvalue')
        .then((response) => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).toBe('post');
          expect(JSON.parse(request.config.data)).toEqual(secret);
          expect(JSON.parse(response.config.data)).toEqual(secret);
        });
    });

    it('should return an error if creation fails', () => {
      moxios.stubRequest(SECRET_URL, {
        status: 400,
        response: { message: 'error-message' },
      });

      return secretApi.createSecret('test', 'testvalue')
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes secret error-message');
        });
    });
  });

  describe('update secret', () => {
    it('should PUT payload to resource URL', () => {
      const secret = createSecret();
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 204,
        response: secret,
      });

      return secretApi.updateSecret('test', 'testvalue')
        .then((response) => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).toBe('put');
          expect(JSON.parse(request.config.data)).toEqual(secret);
          expect(JSON.parse(response.config.data)).toEqual(secret);
        });
    });

    it('should return an error if creation fails', () => {
      moxios.stubRequest(`${SECRET_URL}/${SECRET_NAME}`, {
        status: 400,
        response: { message: 'error-message' },
      });

      return secretApi.updateSecret('test', 'testvalue')
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes secret error-message');
        });
    });
  });
});

function createSecret() {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: { name: 'test' },
    stringData: 'testvalue',
  };
}
