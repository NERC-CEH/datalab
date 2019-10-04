import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import serviceApi from './serviceApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = 'namespace';

const SERVICE_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/services`;
const SERVICE_NAME = 'test-service';

beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const service = createService();
const manifest = createManifest();

describe('Kubernetes Service API', () => {
  describe('get service', () => {
    it('should return the service if it exists', () => {
      mock.onGet(`${SERVICE_URL}/${SERVICE_NAME}`).reply(200, service);

      return serviceApi.getService(SERVICE_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toEqual(service);
        });
    });

    it('should return undefined it the service does not exist', () => {
      mock.onGet(`${SERVICE_URL}/${SERVICE_NAME}`).reply(404, service);

      return serviceApi.getService(SERVICE_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create service', () => {
    it('should POST manifest to bare resource URL', () => {
      mock.onPost(SERVICE_URL, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, service];
      });

      return serviceApi.createService(SERVICE_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(service);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPost(SERVICE_URL).reply(400, { message: 'error-message' });

      try {
        await serviceApi.createService(SERVICE_NAME, NAMESPACE, manifest);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes service \'test-service\' - error-message');
      }
    });
  });

  describe('update service', () => {
    it('should PUT payload to resource URL', () => {
      mock.onPut(`${SERVICE_URL}/${SERVICE_NAME}`).reply(200, service);

      return serviceApi.updateService(SERVICE_NAME, NAMESPACE, manifest, service)
        .then((response) => {
          expect(response.data).toEqual(service);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPut(`${SERVICE_URL}/${SERVICE_NAME}`).reply(400, { message: 'error-message' });

      try {
        await serviceApi.updateService(SERVICE_NAME, NAMESPACE, manifest, service);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes service \'test-service\' - error-message');
      }
    });
  });

  describe('createOrUpdate service', () => {
    it('should CREATE if service does not exist', () => {
      mock.onGet(`${SERVICE_URL}/${SERVICE_NAME}`).reply(404);
      mock.onPost().reply(204, service);

      return serviceApi.createOrUpdateService(SERVICE_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response).toEqual(service);
        });
    });

    it('should REPLACE if service exists', () => {
      mock.onGet(`${SERVICE_URL}/${SERVICE_NAME}`).reply(200, service);
      mock.onDelete().reply(204);
      mock.onPost().reply(204, service);

      return serviceApi.createOrUpdateService(SERVICE_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response).toEqual(service);
        });
    });
  });

  describe('delete service', () => {
    it('should DELETE resource URL', () => {
      mock.onDelete(`${SERVICE_URL}/${SERVICE_NAME}`).reply(204);

      return expect(serviceApi.deleteService(SERVICE_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return successfully if service does not exist', () => {
      mock.onDelete(`${SERVICE_URL}/${SERVICE_NAME}`).reply(404);

      return expect(serviceApi.deleteService(SERVICE_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return error if server errors', () => {
      mock.onDelete(`${SERVICE_URL}/${SERVICE_NAME}`).reply(500, { message: 'error-message' });

      return expect(serviceApi.deleteService(SERVICE_NAME, NAMESPACE))
        .rejects.toEqual(new Error('Kubernetes API: Request failed with status code 500'));
    });
  });
});

function createService() {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: SERVICE_NAME,
      resourceVersion: 1,
    },
    spec: { clusterIP: '127.0.0.1' },
  };
}

function createManifest() {
  return 'apiVersion: v1\n'
    + 'kind: Service\n'
    + 'metadata:\n'
    + '  name: test-service\n'
    + 'spec:\n'
    + '  type: NodePort\n';
}
