import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import deploymentApi from './deploymentApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const DEPLOYMENT_URL = `${API_BASE}/apis/apps/v1beta1/namespaces/${NAMESPACE}/deployments`;
const DEPLOYMENT_NAME = 'test-deployment';
beforeEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

describe('Kubernetes Deployment API', () => {
  describe('get deployment', () => {
    it('should return the deployment if it exists', () => {
      const deployment = createDeployment();
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(200, deployment);

      return deploymentApi.getDeployment(DEPLOYMENT_NAME)
        .then((response) => {
          expect(response).toEqual(deployment);
        });
    });

    it('should return undefined it the deployment does not exist', () => {
      const deployment = createDeployment();
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(404, deployment);

      return deploymentApi.getDeployment(DEPLOYMENT_NAME)
        .then((response) => {
          expect(response).toBeUndefined();
        });
    });
  });

  describe('create deployment', () => {
    it('should POST manifest to bare resource URL', () => {
      const manifest = createManifest();
      const deployment = createDeployment();
      mock.onPost(DEPLOYMENT_URL, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, deployment];
      });

      return deploymentApi.createDeployment(manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should return an error if creation fails', () => {
      const manifest = createManifest();

      mock.onPost(DEPLOYMENT_URL).reply(400, { message: 'error-message' });

      return deploymentApi.createDeployment(manifest)
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes deployment error-message');
        });
    });
  });

  describe('update secret', () => {
    it('should PUT payload to resource URL', () => {
      const manifest = createManifest();
      const deployment = createDeployment();

      mock.onPut(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`, manifest).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, deployment];
      });

      return deploymentApi.updateDeployment(DEPLOYMENT_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should return an error if creation fails', () => {
      const manifest = createManifest();
      mock.onPut(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(400, { message: 'error-message' });

      return deploymentApi.updateDeployment(DEPLOYMENT_NAME, manifest)
        .catch((error) => {
          expect(error.toString()).toEqual('Error: Unable to create kubernetes deployment error-message');
        });
    });
  });

  describe('createOrUpdate secret', () => {
    it('should CREATE if secret does not exist', () => {
      const manifest = createManifest();
      const deployment = createDeployment();

      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(404);
      mock.onPost().reply(204, deployment);

      return deploymentApi.createOrUpdateDeployment(DEPLOYMENT_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
    });

    it('should UPDATE if secret exists', () => {
      const manifest = createManifest();
      const deployment = createDeployment();
      mock.onGet(`${DEPLOYMENT_URL}/${DEPLOYMENT_NAME}`).reply(200, { data: deployment });
      mock.onPut().reply(204, deployment);

      return deploymentApi.createOrUpdateDeployment(DEPLOYMENT_NAME, manifest)
        .then((response) => {
          expect(response.data).toEqual(deployment);
        });
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

function createManifest() {
  return 'apiVersion: extensions/v1beta1\n' +
      'kind: Deployment';
}
