import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import ingressApi from './ingressApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = 'namespace';

const INGRESS_URL = `${API_BASE}/apis/networking.k8s.io/v1beta1/namespaces/${NAMESPACE}/ingresses`;
const INGRESS_NAME = 'test-ingress';
beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const manifest = createManifest();
const ingress = createIngress();

describe('Kubernetes Ingress API', () => {
  describe('get ingress', () => {
    it('should return the ingress if it exists', () => {
      mock.onGet(`${INGRESS_URL}/${INGRESS_NAME}`).reply(200, ingress);

      return ingressApi.getIngress(INGRESS_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toEqual(ingress);
        });
    });

    it('should return undefined it the ingress does not exist', () => {
      mock.onGet(`${INGRESS_URL}/${INGRESS_NAME}`).reply(404, ingress);

      return ingressApi.getIngress(INGRESS_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create ingress', () => {
    it('should POST manifest to bare resource URL', () => {
      mock.onPost(INGRESS_URL, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, ingress];
      });

      return ingressApi.createIngress(INGRESS_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(ingress);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPost(INGRESS_URL).reply(400, { message: 'error-message' });

      try {
        await ingressApi.createIngress(INGRESS_NAME, NAMESPACE, manifest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes ingress \'test-ingress\' - error-message');
      }
    });
  });

  describe('update ingress', () => {
    it('should PUT payload to resource URL', () => {
      mock.onPut(`${INGRESS_URL}/${INGRESS_NAME}`, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, ingress];
      });

      return ingressApi.updateIngress(INGRESS_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(ingress);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPut(`${INGRESS_URL}/${INGRESS_NAME}`).reply(400, { message: 'error-message' });

      try {
        await ingressApi.updateIngress(INGRESS_NAME, NAMESPACE, manifest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes ingress \'test-ingress\' - error-message');
      }
    });
  });

  describe('createOrUpdate ingress', () => {
    it('should CREATE if ingress does not exist', () => {
      mock.onGet(`${INGRESS_URL}/${INGRESS_NAME}`).reply(404);
      mock.onPost().reply(204, ingress);

      return ingressApi.createOrUpdateIngress(INGRESS_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(ingress);
        });
    });

    it('should UPDATE if ingress exists', () => {
      mock.onGet(`${INGRESS_URL}/${INGRESS_NAME}`).reply(200, ingress);
      mock.onPut().reply(204, ingress);

      return ingressApi.createOrUpdateIngress(INGRESS_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(ingress);
        });
    });
  });

  describe('delete ingress', () => {
    it('should DELETE resource URL', () => {
      mock.onDelete(`${INGRESS_URL}/${INGRESS_NAME}`).reply(204);

      return expect(ingressApi.deleteIngress(INGRESS_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return successfully if ingress does not exist', () => {
      mock.onDelete(`${INGRESS_URL}/${INGRESS_NAME}`).reply(404);

      return expect(ingressApi.deleteIngress(INGRESS_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return error if server errors', () => {
      mock.onDelete(`${INGRESS_URL}/${INGRESS_NAME}`).reply(500, { message: 'error-message' });

      return expect(ingressApi.deleteIngress(INGRESS_NAME, NAMESPACE))
        .rejects.toEqual(new Error('Kubernetes API: Request failed with status code 500'));
    });
  });
});

function createIngress() {
  return {
    apiVersion: 'apps/v1beta1',
    kind: 'Ingress',
    metadata: { name: INGRESS_NAME },
  };
}

function createManifest() {
  return 'apiVersion: extensions/v1beta1\n'
    + 'kind: Ingress';
}
