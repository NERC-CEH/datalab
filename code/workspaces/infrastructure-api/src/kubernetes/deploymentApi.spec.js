import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import deploymentApi from './deploymentApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = 'namespace';

const DEPLOYMENT_URL = `${API_BASE}/apis/apps/v1/namespaces/${NAMESPACE}/deployments`;
const DEPLOYMENT_NAME = 'test-deployment';

beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const manifest = createManifest();
const deployment = createDeployment();

describe('Kubernetes Deployment API', () => {
  describe('get deployment', () => {
    it('should return the deployment if it exists', () => {
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(200, deployment);

      return deploymentApi.getDeployment(DEPLOYMENT_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toEqual(deployment);
        });
    });

    it('should return undefined it the deployment does not exist', () => {
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(404, deployment);

      return deploymentApi.getDeployment(DEPLOYMENT_NAME, NAMESPACE)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create deployment', () => {
    it('should POST manifest to bare resource URL', () => {
      mock.onPost(DEPLOYMENT_URL, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, deployment];
      });

      return deploymentApi.createDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPost(DEPLOYMENT_URL).reply(400, { message: 'error-message' });

      try {
        await deploymentApi.createDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes deployment \'test-deployment\' - error-message');
      }
    });
  });

  describe('update deployment', () => {
    it('should PUT payload to resource URL', () => {
      mock.onPut(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, deployment];
      });

      return deploymentApi.updateDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should return an error if creation fails', async () => {
      mock.onPut(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(400, { message: 'error-message' });

      try {
        await deploymentApi.updateDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.toString()).toEqual('Error: Kubernetes API: Unable to create kubernetes deployment \'test-deployment\' - error-message');
      }
    });
  });

  describe('createOrUpdate deployment', () => {
    it('should CREATE if secret does not exist', () => {
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(404);
      mock.onPost().reply(204, deployment);

      return deploymentApi.createOrUpdateDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should UPDATE if deployment exists', () => {
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(200, deployment);
      mock.onPut().reply(204, deployment);

      return deploymentApi.createOrUpdateDeployment(DEPLOYMENT_NAME, NAMESPACE, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });
  });

  describe('delete deployment', () => {
    it('should DELETE resource URL', () => {
      mock.onDelete(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(204);

      return expect(deploymentApi.deleteDeployment(DEPLOYMENT_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return successfully if deployment does not exist', () => {
      mock.onDelete(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(404);

      return expect(deploymentApi.deleteDeployment(DEPLOYMENT_NAME, NAMESPACE)).resolves.toBeUndefined();
    });

    it('should return error if server errors', () => {
      mock.onDelete(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(500, { message: 'error-message' });

      return expect(deploymentApi.deleteDeployment(DEPLOYMENT_NAME, NAMESPACE))
        .rejects.toEqual(new Error('Kubernetes API: Request failed with status code 500'));
    });
  });

  describe('restart deployment', () => {
    it('should down and up scale deployment', async () => {
      // Arrange
      const patchSpy = jest.fn();
      mock.onPatch(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`).reply((requestConfig) => {
        patchSpy(JSON.parse(requestConfig.data));
        return [204];
      });
      const getSpy = jest.fn();
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`)
        .replyOnce((requestConfig) => {
          getSpy(requestConfig);
          return [200, createScale(1, 1)]; // initial state
        });
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`)
        .replyOnce((requestConfig) => {
          getSpy(requestConfig);
          return [200, createScale(0, 1)]; // downscale incomplete
        });
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`)
        .replyOnce((requestConfig) => {
          getSpy(requestConfig);
          return [200, createScale(0, 0)]; // downscale complete
        });
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`)
        .replyOnce((requestConfig) => {
          getSpy(requestConfig);
          return [200, createScale(1, 0)]; // upscale incomplete
        });
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`)
        .replyOnce((requestConfig) => {
          getSpy(requestConfig);
          return [200, createScale(1, 1)]; // upscale complete
        });

      // Act
      await deploymentApi.restartDeployment(DEPLOYMENT_NAME, NAMESPACE);

      // Assert
      expect(getSpy).toHaveBeenCalledTimes(5);
      expect(patchSpy).toHaveBeenCalledTimes(2);
      expect(patchSpy).toHaveBeenNthCalledWith(1, { spec: { replicas: 0 } });
      expect(patchSpy).toHaveBeenNthCalledWith(2, { spec: { replicas: 1 } });
    });

    it('should return an error if restart fails', async () => {
      // Arrange
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}/scale`).reply(400, { message: 'error-message' });

      // Act/Assert
      await expect(deploymentApi.restartDeployment(DEPLOYMENT_NAME, NAMESPACE)).rejects.toThrow('Request failed with status code 400');
    });
  });
});

function createDeployment() {
  return {
    apiVersion: 'apps/v1beta1',
    kind: 'Deployment',
    metadata: { name: DEPLOYMENT_NAME },
  };
}

function createScale(specReplicas, statusReplicas) {
  return {
    spec: {
      replicas: specReplicas,
    },
    status: {
      replicas: statusReplicas,
    },
  };
}

function createManifest() {
  return 'apiVersion: extensions/v1beta1\n'
      + 'kind: Deployment';
}
