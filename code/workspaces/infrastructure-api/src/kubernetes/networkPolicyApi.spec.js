import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config/config';
import networkPolicyApi from './networkPolicyApi';

const mockAxios = new MockAdapter(axios);
const apiBase = config.get('kubernetesApi');
const namespace = 'namespace';
const netPolUrl = `${apiBase}/apis/networking.k8s.io/v1/namespaces/${namespace}/networkpolicies`;
const netPolName = 'netPol-name';

const netPolResource = {
  metadata: {
    name: netPolName,
  },
};
const netPolManifest = JSON.stringify(netPolResource);

beforeEach(() => {
  mockAxios.reset();
  mockAxios.resetHistory();
});

describe('networkPolicyApi', () => {
  describe('getNetworkPolicy', () => {
    it('should return the network policy if it exists', async () => {
      mockAxios.onGet(`${netPolUrl}/${netPolName}`).reply(200, netPolResource);
      const response = await networkPolicyApi.getNetworkPolicy(netPolName, namespace);
      expect(response).toEqual(netPolResource);
    });

    it('should return undefined it the network policy does not exist', async () => {
      mockAxios.onGet(`${netPolUrl}/${netPolName}`).reply(404, {});
      const response = await networkPolicyApi.getNetworkPolicy(netPolName, namespace);
      expect(response).toBeUndefined();
    });
  });

  describe('createNetworkPolicy', () => {
    it('should POST manifest to bare resource URL', async () => {
      mockAxios.onPost(netPolUrl).reply(200, netPolResource);
      const response = await networkPolicyApi.createNetworkPolicy(netPolName, namespace, netPolManifest);
      expect(response.data).toEqual(netPolResource);
      expect(mockAxios.history.post[0].headers['Content-Type']).toBe('application/yaml');
      expect(mockAxios.history.post[0].data).toEqual(netPolManifest);
    });

    it('should return an error if creation fails', async () => {
      mockAxios.onPost(netPolUrl).reply(400, { message: 'error-message' });
      await expect(networkPolicyApi.createNetworkPolicy(netPolName, namespace, netPolManifest))
        .rejects.toThrow(`Kubernetes API: Unable to create kubernetes network policy '${netPolName}' - error-message`);
    });
  });

  describe('deleteNetworkPolicy', () => {
    it('should DELETE resource URL', async () => {
      mockAxios.onDelete(`${netPolUrl}/${netPolName}`).reply(204);
      const response = await networkPolicyApi.deleteNetworkPolicy(netPolName, namespace, netPolManifest);
      expect(response).toBeUndefined();
    });

    it('should return successfully if network policy does not exist', async () => {
      mockAxios.onDelete(`${netPolUrl}/${netPolName}`).reply(404);
      const response = await networkPolicyApi.deleteNetworkPolicy(netPolName, namespace, netPolManifest);
      expect(response).toBeUndefined();
    });

    it('should return an error if delete fails', async () => {
      mockAxios.onDelete(`${netPolUrl}/${netPolName}`).reply(500, { message: 'error-message' });
      await expect(networkPolicyApi.deleteNetworkPolicy(netPolName, namespace, netPolManifest)).rejects.toThrow('Kubernetes API: Request failed with status code 500');
    });
  });

  describe('createOrUpdateNetworkPolicy', () => {
    it('should CREATE if network policy does not exist', async () => {
      mockAxios.onGet(`${netPolUrl}/${netPolName}`).reply(404);
      mockAxios.onPost(netPolUrl).reply(204, netPolResource);
      const response = await networkPolicyApi.createOrUpdateNetworkPolicy(netPolName, namespace, netPolManifest);
      expect(response).toEqual(netPolResource);
      expect(mockAxios.history.delete.length).toEqual(0);
    });

    it('should REPLACE if network policy does exist', async () => {
      mockAxios.onGet(`${netPolUrl}/${netPolName}`).reply(200, netPolResource);
      mockAxios.onDelete(`${netPolUrl}/${netPolName}`).reply(204);
      mockAxios.onPost(netPolUrl).reply(204, netPolResource);
      const response = await networkPolicyApi.createOrUpdateNetworkPolicy(netPolName, namespace, netPolManifest);
      expect(response).toEqual(netPolResource);
      expect(mockAxios.history.delete.length).toEqual(1);
    });
  });
});
