import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import podsApi from './podsApi';
import config from '../config/config';

const mock = new MockAdapter(axios);
const API_BASE = config.get('kubernetesApi');
const PODS_URL = `${API_BASE}/api/v1/pods`;

const pods = createPods();

describe('podsApi', () => {
  it('getStacks', async () => {
    // Arrange
    mock.onGet(PODS_URL).reply(200, pods);

    // Act
    const stacks = await podsApi.getStacks();

    // Assert
    expect(stacks).toEqual([
      {
        name: 'jupyter-url',
        namespace: 'test-namespace',
        type: 'jupyter',
        status: 'running',
        podName: 'jupyter-url-some-uuid',
      },
      {
        name: 'nbviewer-url',
        namespace: 'test-namespace',
        type: 'nbviewer',
        status: 'running',
        podName: 'nbviewer-url-some-uuid',
      },
    ]);
  });
});

function createPodItem(name, userPod, phase) {
  return {
    metadata: {
      labels: {
        name,
        'user-pod': userPod,
      },
      namespace: 'test-namespace',
      name: `${name}-some-uuid`,
    },
    status: {
      phase,
    },
  };
}

function createPods() {
  return {
    apiVersion: 'v1',
    kind: 'PodList',
    items: [
      createPodItem('minio-store', 'minio', 'running'),
      createPodItem('jupyter-url', 'jupyter', 'running'),
      createPodItem('nbviewer-url', 'nbviewer', 'running'),
    ],
  };
}
