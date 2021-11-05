import { clusterList } from 'common/src/config/images';
import logger from '../config/logger';
import statusChecker from './statusChecker';
import * as podsApi from '../kubernetes/podsApi';
import * as stackRepository from '../dataaccess/stacksRepository';
import * as clustersRepository from '../dataaccess/clustersRepository';
import { getStacksAndClustersDeployments } from '../kubernetes/deploymentApi';

jest.mock('common/src/config/images');
jest.mock('../config/logger');
jest.mock('../kubernetes/podsApi');
jest.mock('../kubernetes/deploymentApi');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../dataaccess/clustersRepository');

const getStacksAndClustersMock = jest.fn();
const updateStackStatusMock = jest.fn();
const updateClusterStatusMock = jest.fn();

podsApi.default = {
  getStacksAndClusters: getStacksAndClustersMock,
};

stackRepository.default = {
  updateStatus: updateStackStatusMock,
};

clustersRepository.default = {
  updateStatus: updateClusterStatusMock,
};

const stacks = [
  { name: 'expectedType-firstPod', namespace: 'a', status: 'Evicted' },
  { name: 'expectedType-firstPod', namespace: 'a', status: 'Running' },
  { name: 'expectedType-secondPod', namespace: 'a', status: 'Running' },
  { name: 'expectedType-thirdPod', namespace: 'b', status: 'Terminating' },
  { name: 'expectedType-fourthPod', namespace: 'b', status: 'Init:0/2' },
];

beforeEach(() => {
  getStacksAndClustersMock.mockResolvedValue(stacks);
  updateStackStatusMock.mockResolvedValue({ n: 1 });
  updateClusterStatusMock.mockResolvedValue({ n: 1 });
});

describe('Stack Status Checker', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();
    clusterList.mockReturnValue(['cluster']);

    getStacksAndClustersDeployments.mockResolvedValue([]);
  });

  it('updates stack records with correct status', async () => {
    await statusChecker();
    expect(updateStackStatusMock.mock.calls).toMatchSnapshot();
  });

  it('updates stack records with suspended stacks as well', async () => {
    // return a deployment not in the pods list with 0 replicas to simulate a suspended notebook
    getStacksAndClustersDeployments.mockResolvedValueOnce([
      { name: 'expectedType-suspendedPod', namespace: 'a', replicas: 0 },
    ]);

    await statusChecker();

    expect(updateStackStatusMock.mock.calls).toMatchSnapshot();
  });

  it('updates stack records with unavailable for scaled up deployments with no pods', async () => {
    getStacksAndClustersMock.mockResolvedValue([]);
    getStacksAndClustersDeployments.mockResolvedValueOnce([
      { name: 'expectedType-missingPod', namespace: 'a', replicas: 1 },
    ]);

    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'missingPod',
      namespace: 'a',
      status: 'unavailable',
      type: 'expectedType',
    });
  });

  it('updates stack records with suspended for scaled down deployments with pods being terminated', async () => {
    getStacksAndClustersMock.mockResolvedValue([
      { name: 'expectedType-firstPod', namespace: 'a', status: 'Running' },
    ]);
    getStacksAndClustersDeployments.mockResolvedValueOnce([
      { name: 'expectedType-firstPod', namespace: 'a', replicas: 0 },
    ]);

    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'firstPod',
      namespace: 'a',
      status: 'suspended',
      type: 'expectedType',
    });
  });

  it('updates stack record for Running stack', async () => {
    getStacksAndClustersMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Running', namespace: 'expectedNamespace' },
    ]));

    expect(updateStackStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'ready',
      type: 'expectedType',
    });
  });

  it('updates stack record for Requested stack', async () => {
    getStacksAndClustersMock.mockResolvedValue([
      { name: 'expectedType-expectedPodName', status: 'Pending', namespace: 'expectedNamespace' },
    ]);

    expect(updateStackStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'requested',
      type: 'expectedType',
    });
  });

  it('updates stack record for Creating stack', async () => {
    getStacksAndClustersMock.mockResolvedValue([
      { name: 'expectedType-expectedPodName', status: 'CrashLoopBackOff', namespace: 'expectedNamespace' },
    ]);

    expect(updateStackStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'unavailable',
      type: 'expectedType',
    });
  });

  it('updates cluster record for Running cluster', async () => {
    getStacksAndClustersMock.mockResolvedValue([
      { name: 'cluster-expectedPodName', status: 'Running', namespace: 'expectedNamespace' },
    ]);

    expect(updateClusterStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateClusterStatusMock).toHaveBeenCalledTimes(1);
    expect(updateClusterStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'ready',
      type: 'cluster',
    });
  });

  it('updates stack record to creating when newest pod will not start', async () => {
    // make sure pod info is returned in reverse order to emulate what's happening in the cluster
    // for bug NERCDL-1142
    const badStartingStack = [
      { name: 'expectedType-firstPod', namespace: 'a', status: 'PodInitializing', creationTimestamp: Date.parse('2021-11-05T16:47:00Z') },
      { name: 'expectedType-firstPod', namespace: 'a', status: 'Running', creationTimestamp: Date.parse('2021-11-04T16:47:00Z') },
    ];
    getStacksAndClustersMock.mockResolvedValue(badStartingStack);

    await statusChecker();

    expect(updateStackStatusMock).toHaveBeenCalledWith({
      name: 'firstPod',
      namespace: 'a',
      status: 'creating',
      type: 'expectedType',
    });
  });
});
