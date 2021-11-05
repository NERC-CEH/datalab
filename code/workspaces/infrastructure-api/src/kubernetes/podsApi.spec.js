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
    const stacks = await podsApi.getStacksAndClusters();

    // Assert
    expect(stacks).toEqual([
      {
        name: 'jupyter-url',
        namespace: 'test-namespace',
        type: 'jupyter',
        status: 'running',
        podName: 'jupyter-url-some-uuid',
        creationTimestamp: Date.parse('2021-11-05T15:47:00Z'),
      },
      {
        name: 'nbviewer-url',
        namespace: 'test-namespace',
        type: 'nbviewer',
        status: 'running',
        podName: 'nbviewer-url-some-uuid',
        creationTimestamp: Date.parse('2021-11-05T14:47:00Z'),
      },
    ]);
  });
});

function createPodItem(name, userPod, phase, created) {
  return {
    metadata: {
      labels: {
        name,
        'user-pod': userPod,
      },
      namespace: 'test-namespace',
      name: `${name}-some-uuid`,
      creationTimestamp: created,
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
      createPodItem('minio-store', 'minio', 'running', '2021-11-05T16:47:00Z'),
      createPodItem('jupyter-url', 'jupyter', 'running', '2021-11-05T15:47:00Z'),
      createPodItem('nbviewer-url', 'nbviewer', 'running', '2021-11-05T14:47:00Z'),
    ],
  };
}
