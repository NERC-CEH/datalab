import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import volumeApi from './volumeApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const PVC_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/persistentvolumeclaims`;
const PVC_NAME = 'test-pvc';
const PVC_TYPE = 'volume-type';
const PVC_CAPACITY = '12Gi';

beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const manifest = createManifest();
const pvc = createPVC();
const pvcs = createPVCs();

describe('Kubernetes Persistent Volume API', () => {
  describe('get pvc', () => {
    it('should return the pvc if it exists', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(200, pvc);

      return volumeApi.getPersistentVolumeClaim(PVC_NAME)
        .then((response) => {
          expect(response).toEqual(pvc);
        });
    });

    it('should return undefined if the pvc does not exist', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(404);

      return volumeApi.getPersistentVolumeClaim(PVC_NAME)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create pvc', () => {
    it('should POST manifest to bare resource URL', () => {
      mock.onPost(PVC_URL, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, pvc];
      });

      return volumeApi.createPersistentVolumeClaim(PVC_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(pvc);
        });
    });

    it('should return an error if creation fails', () => {
      mock.onPost(PVC_URL).reply(400, { message: 'error-message' });

      return volumeApi.createPersistentVolumeClaim(PVC_NAME, manifest)
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes persistent volume claim error-message');
        });
    });
  });

  describe('update pvc', () => {
    it('should PUT payload to resource URL', () => {
      mock.onPut(`${PVC_URL}/${PVC_NAME}`, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, pvc];
      });

      return volumeApi.updatePersistentVolumeClaim(PVC_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(pvc);
        });
    });

    it('should return an error if creation fails', () => {
      mock.onPut(`${PVC_URL}/${PVC_NAME}`).reply(400, { message: 'error-message' });

      return volumeApi.updatePersistentVolumeClaim(PVC_NAME, manifest)
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes persistent volume claim error-message');
        });
    });
  });

  describe('createOrUpdate pvc', () => {
    it('should CREATE if pvc does not exist', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(404);
      mock.onPost().reply(204, pvc);

      return volumeApi.createOrUpdatePersistentVolumeClaim(PVC_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(pvc);
        });
    });

    it('should UPDATE if pvc exists', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(200, pvc);
      mock.onPut().reply(204, pvc);

      return volumeApi.createOrUpdatePersistentVolumeClaim(PVC_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(pvc);
        });
    });
  });

  describe('delete pvc', () => {
    it('should DELETE resource URL', () => {
      mock.onDelete(`${PVC_URL}/${PVC_NAME}`).reply(204);

      return expect(volumeApi.deletePersistentVolumeClaim(PVC_NAME)).resolves.toBeUndefined();
    });

    it('should return successfully if pvc does not exist', () => {
      mock.onDelete(`${PVC_URL}/${PVC_NAME}`).reply(404);

      return expect(volumeApi.deletePersistentVolumeClaim(PVC_NAME)).resolves.toBeUndefined();
    });

    it('should return error if server errors', () => {
      mock.onDelete(`${PVC_URL}/${PVC_NAME}`).reply(500, { message: 'error-message' });

      return expect(volumeApi.deletePersistentVolumeClaim(PVC_NAME))
        .rejects.toEqual(new Error('Kubernetes API: Request failed with status code 500'));
    });
  });

  describe('query pvc', () => {
    it('should return the pvc if it exists', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(200, pvc);

      return volumeApi.queryPersistentVolumeClaim(PVC_NAME)
        .then((response) => {
          expect(response).toEqual({
            name: PVC_NAME,
            storageType: PVC_TYPE,
            capacityTotal: PVC_CAPACITY,
          });
        });
    });

    it('should return an empty object if the pvc does not exist', () => {
      mock.onGet(`${PVC_URL}/${PVC_NAME}`).reply(404);

      return volumeApi.queryPersistentVolumeClaim(PVC_NAME)
        .then((response) => {
          expect(response).toEqual({});
        });
    });
  });

  describe('list pvcs', () => {
    it('should return an array of pvcs', () => {
      mock.onGet(`${PVC_URL}`, { params: { labelSelector: 'userCreated' } }).reply(200, pvcs);

      return volumeApi.listPersistentVolumeClaims()
        .then((response) => {
          expect(response.length).toBe(2);
          expect(response[0]).toEqual({
            name: PVC_NAME,
            storageType: PVC_TYPE,
            capacityTotal: PVC_CAPACITY,
          });
        });
    });

    it('should return an empty array if the pvc does not exist', () => {
      mock.onGet(`${PVC_URL}`, { params: { labelSelector: 'userCreated' } }).reply(404);

      return volumeApi.listPersistentVolumeClaims()
        .then((response) => {
          expect(response).toEqual([]);
        });
    });
  });
});

function createPVC() {
  return {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: PVC_NAME,
      annotations: {
        'volume.beta.kubernetes.io/storage-class': PVC_TYPE,
      },
    },
    spec: {
      resources: {
        requests: {
          storage: PVC_CAPACITY,
        },
      },
    },
  };
}

function createPVCs() {
  return {
    items: [
      createPVC(),
      createPVC(),
    ],
  };
}

function createManifest() {
  return 'apiVersion: v1\n' +
    'kind: PersistentVolumeClaim';
}
