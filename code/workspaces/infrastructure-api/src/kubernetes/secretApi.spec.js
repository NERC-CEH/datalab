import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import secretApi from './secretApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = 'namespace';

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

      return secretApi.createOrUpdateSecret('test', NAMESPACE, 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should UPDATE if secret exists', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(200, secret);
      mock.onPut().reply(204, secret);

      return secretApi.createOrUpdateSecret('test', NAMESPACE, 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });
  });

  describe('get secret', () => {
    it('should return the secret if it exists', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(200, secret);

      return secretApi.getSecret('test', NAMESPACE)
        .then((response) => {
          expect(response).toEqual(secret);
        });
    });

    it('should return undefined it the secret does not exist', () => {
      const secret = createSecret();
      mock.onGet(`${SECRET_URL}/${SECRET_NAME}`).reply(404, secret);

      return secretApi.getSecret('test', NAMESPACE)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create secret', () => {
    it('should POST payload to bare resource URL', () => {
      const secret = createSecret();
      mock.onPost(SECRET_URL, secret).reply(204, secret);

      return secretApi.createSecret('test', NAMESPACE, 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should return an error if creation fails', () => {
      mock.onPost(SECRET_URL).reply(400, { message: 'error-message' });

      return secretApi.createSecret('test', NAMESPACE, 'testvalue')
        .then(() => expect(true).toBe(false))
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes secret \'test\' - error-message');
        });
    });
  });

  describe('update secret', () => {
    it('should PUT payload to resource URL', () => {
      const secret = createSecret();
      mock.onPut(`${SECRET_URL}/${SECRET_NAME}`, secret).reply(204, secret);

      return secretApi.updateSecret('test', NAMESPACE, 'testvalue')
        .then((response) => {
          expect(response.data).toEqual(secret);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPut(`${SECRET_URL}/${SECRET_NAME}`).reply(400, { message: 'error-message' });

      try {
        await secretApi.updateSecret('test', NAMESPACE, 'testvalue');
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes secret \'test\' - error-message');
      }
    });
  });

  describe('delete secret', () => {
    it('should DELETE resource URL', () => {
      mock.onDelete(`${SECRET_URL}/${SECRET_NAME}`).reply(204);

      return expect(secretApi.deleteSecret(SECRET_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return successfully if secret does not exist', () => {
      mock.onDelete(`${SECRET_URL}/${SECRET_NAME}`).reply(404);

      return expect(secretApi.deleteSecret(SECRET_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return error if server errors', () => {
      mock.onDelete(`${SECRET_URL}/${SECRET_NAME}`).reply(500, { message: 'error-message' });

      return expect(secretApi.deleteSecret(SECRET_NAME, NAMESPACE))
        .rejects.toEqual(new Error('Kubernetes API: Request failed with status code 500'));
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
