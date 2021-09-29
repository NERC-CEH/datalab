import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import data from 'common/src/config/clusters_config.json';
import { initialiseClusters, getClusterMaxWorkers, getWorkerCpuMax, getWorkerMemoryMax, getCondaRequired } from './clusters';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/clusters_config.json').reply(() => [200, data]);

const CLUSTER_TYPE = 'DASK';

describe('getClusterMaxWorkers', () => {
  it('returns correct value', async () => {
    await initialiseClusters();
    const maxWorkers = getClusterMaxWorkers(CLUSTER_TYPE);
    expect(maxWorkers).toMatchSnapshot();
  });
});

describe('getWorkerMemoryMax', () => {
  it('returns correct value', async () => {
    await initialiseClusters();
    const maxMemory = getWorkerMemoryMax(CLUSTER_TYPE);
    expect(maxMemory).toMatchSnapshot();
  });
});

describe('getWorkerCpuMax', () => {
  it('returns correct value', async () => {
    await initialiseClusters();
    const maxCpu = getWorkerCpuMax(CLUSTER_TYPE);
    expect(maxCpu).toMatchSnapshot();
  });
});

describe('getCondaRequired', () => {
  it('returns correct value', async () => {
    await initialiseClusters();
    const condaRequired = getCondaRequired(CLUSTER_TYPE);
    expect(condaRequired).toBeFalsy();
  });
});

