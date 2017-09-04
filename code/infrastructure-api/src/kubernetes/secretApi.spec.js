import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import secretApi from './secretApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const SECRET_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/secrets`;
const SECRET_NAME = 'test';

describe('Kubernetes Secret API', () => {
  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('createOrUpdate secret', () => {
    it('should CREATE if secret does not exist', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(404);
      mock.onPost().reply(204, secret);

      return secretApi.createOrUpdateSecret('test', 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should UPDATE if secret exists', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(200, secret);
      mock.onPut().reply(204, secret);

      return secretApi.createOrUpdateSecret('test', 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });
  });

  describe('get secret', () => {
    it('should return the secret if it exists', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(200, secret);

      return secretApi.getSecret('test')
        .then((response) => {
          expect(response).toEqual(secret);
        });
    });

    it('should return undefined it the secret does not exist', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(404, secret);

      return secretApi.getSecret('test')
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create secret', () => {
    it('should POST payload to bare resource URL', () => {
      const secret = createSecret();
      mock.onPost(SECRET_URL, secret).reply(204, secret);

      return secretApi.createSecret('test', 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should return an error if creation fails', () => {
      mock.onPost(SECRET_URL).reply(400, { message: 'error-message' });

      return secretApi.createSecret('test', 'testvalue')
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes secret error-message');
        });
    });
  });

  describe('update secret', () => {
    it('should PUT payload to resource URL', () => {
      const secret = createSecret();
      mock.onPut(`${SECRET_URL}/${SECRET_NAME}`, secret).reply(204, secret);

      return secretApi.updateSecret('test', 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should return an error if creation fails', () => {
      mock.onPut(`${SECRET_URL}/${SECRET_NAME}`).reply(400, { message: 'error-message' });

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
