import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config/config';
import autoScalerApi from './autoScalerApi';

const mockAxios = new MockAdapter(axios);
const apiBase = config.get('kubernetesApi');
const namespace = 'namespace';
const hpaUrl = `${apiBase}/apis/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers`;
const hpaName = 'hpa-name';

const hpaResource = {
  metadata: {
    name: hpaName,
  },
};
const hpaManifest = JSON.stringify(hpaResource);

beforeEach(() => {
  mockAxios.reset();
  mockAxios.resetHistory();
});

describe('autoScalerApi', () => {
  describe('getAutoScaler', () => {
    it('should return the hpa if it exists', async () => {
      mockAxios.onGet(`${hpaUrl}/${hpaName}`).reply(200, hpaResource);
      const response = await autoScalerApi.getAutoScaler(hpaName, namespace);
      expect(response).toEqual(hpaResource);
    });

    it('should return undefined it the hpa does not exist', async () => {
      mockAxios.onGet(`${hpaUrl}/${hpaName}`).reply(404, {});
      const response = await autoScalerApi.getAutoScaler(hpaName, namespace);
      expect(response).toBeUndefined();
    });
  });

  describe('createAutoScaler', () => {
    it('should POST manifest to bare resource URL', async () => {
      mockAxios.onPost(hpaUrl).reply(200, hpaResource);
      const response = await autoScalerApi.createAutoScaler(hpaName, namespace, hpaManifest);
      expect(response.data).toEqual(hpaResource);
      expect(mockAxios.history.post[0].headers['Content-Type']).toBe('application/yaml');
      expect(mockAxios.history.post[0].data).toEqual(hpaManifest);
    });

    it('should return an error if creation fails', async () => {
      mockAxios.onPost(hpaUrl).reply(400, { message: 'error-message' });
      await expect(autoScalerApi.createAutoScaler(hpaName, namespace, hpaManifest)).rejects.toThrow(`Kubernetes API: Unable to create kubernetes auto-scaler '${hpaName}' - error-message`);
    });
  });

  describe('deleteAutoScaler', () => {
    it('should DELETE resource URL', async () => {
      mockAxios.onDelete(`${hpaUrl}/${hpaName}`).reply(204);
      const response = await autoScalerApi.deleteAutoScaler(hpaName, namespace, hpaManifest);
      expect(response).toBeUndefined();
    });

    it('should return successfully if hpa does not exist', async () => {
      mockAxios.onDelete(`${hpaUrl}/${hpaName}`).reply(404);
      const response = await autoScalerApi.deleteAutoScaler(hpaName, namespace, hpaManifest);
      expect(response).toBeUndefined();
    });

    it('should return an error if delete fails', async () => {
      mockAxios.onDelete(`${hpaUrl}/${hpaName}`).reply(500, { message: 'error-message' });
      await expect(autoScalerApi.deleteAutoScaler(hpaName, namespace, hpaManifest)).rejects.toThrow('Kubernetes API: Request failed with status code 500');
    });
  });

  describe('createOrUpdateAutoScaler', () => {
    it('should CREATE if hpa does not exist', async () => {
      mockAxios.onGet(`${hpaUrl}/${hpaName}`).reply(404);
      mockAxios.onPost(hpaUrl).reply(204, hpaResource);
      const response = await autoScalerApi.createOrUpdateAutoScaler(hpaName, namespace, hpaManifest);
      expect(response).toEqual(hpaResource);
      expect(mockAxios.history.delete.length).toEqual(0);
    });

    it('should REPLACE if hpa does exist', async () => {
      mockAxios.onGet(`${hpaUrl}/${hpaName}`).reply(200, hpaResource);
      mockAxios.onDelete(`${hpaUrl}/${hpaName}`).reply(204);
      mockAxios.onPost(hpaUrl).reply(204, hpaResource);
      const response = await autoScalerApi.createOrUpdateAutoScaler(hpaName, namespace, hpaManifest);
      expect(response).toEqual(hpaResource);
      expect(mockAxios.history.delete.length).toEqual(1);
    });
  });
});
