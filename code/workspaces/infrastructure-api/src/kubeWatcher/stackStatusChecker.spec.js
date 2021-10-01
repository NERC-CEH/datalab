import logger from '../config/logger';
import statusChecker from './stackStatusChecker';
import * as podsApi from '../kubernetes/podsApi';
import * as stackRepository from '../dataaccess/stacksRepository';
import { getStacksDeployments } from '../kubernetes/deploymentApi';

jest.mock('../config/logger');
jest.mock('../kubernetes/podsApi');
jest.mock('../kubernetes/deploymentApi');
jest.mock('../dataaccess/stacksRepository');

const getStacksMock = jest.fn();
const updateStatusMock = jest.fn();

podsApi.default = {
  getStacks: getStacksMock,
};

stackRepository.default = {
  updateStatus: updateStatusMock,
};

const stacks = [
  { name: 'expectedType-firstPod', namespace: 'a', status: 'Evicted' },
  { name: 'expectedType-firstPod', namespace: 'a', status: 'Running' },
  { name: 'expectedType-secondPod', namespace: 'a', status: 'Running' },
  { name: 'expectedType-thirdPod', namespace: 'b', status: 'Terminating' },
  { name: 'expectedType-fourthPod', namespace: 'b', status: 'Init:0/2' },
];

getStacksMock.mockResolvedValue(stacks);
updateStatusMock.mockResolvedValue({ n: 1 });

describe('Stack Status Checker', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();

    getStacksDeployments.mockResolvedValue([]);
  });

  it('updates stack records with correct status', async () => {
    await statusChecker();
    expect(updateStatusMock.mock.calls).toMatchSnapshot();
  });

  it('updates stack records with suspended stacks as well', async () => {
    // return a deployment not in the pods list with 0 replicas to simulate a suspended notebook
    getStacksDeployments.mockResolvedValueOnce([
      { name: 'expectedType-suspendedPod', namespace: 'a', replicas: 0 },
    ]);

    await statusChecker();

    expect(updateStatusMock.mock.calls).toMatchSnapshot();
  });

  it('updates stack records with unavailable for scaled up deployments with no pods', async () => {
    getStacksMock.mockResolvedValue([]);
    getStacksDeployments.mockResolvedValueOnce([
      { name: 'expectedType-missingPod', namespace: 'a', replicas: 1 },
    ]);

    await statusChecker();

    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'missingPod',
      namespace: 'a',
      status: 'unavailable',
      type: 'expectedType',
    });
  });

  it('updates stack records with suspended for scaled down deployments with pods being terminated', async () => {
    getStacksMock.mockResolvedValue([
      { name: 'expectedType-firstPod', namespace: 'a', status: 'Running' },
    ]);
    getStacksDeployments.mockResolvedValueOnce([
      { name: 'expectedType-firstPod', namespace: 'a', replicas: 0 },
    ]);

    await statusChecker();

    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'firstPod',
      namespace: 'a',
      status: 'suspended',
      type: 'expectedType',
    });
  });

  it('updates stack record for Running stack', async () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Running', namespace: 'expectedNamespace' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'ready',
      type: 'expectedType',
    });
  });

  it('updates stack record for Requested stack', async () => {
    getStacksMock.mockResolvedValue([
      { name: 'expectedType-expectedPodName', status: 'Pending', namespace: 'expectedNamespace' },
    ]);

    expect(updateStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'requested',
      type: 'expectedType',
    });
  });

  it('updates stack record for Creating stack', async () => {
    getStacksMock.mockResolvedValue([
      { name: 'expectedType-expectedPodName', status: 'CrashLoopBackOff', namespace: 'expectedNamespace' },
    ]);

    expect(updateStatusMock).not.toHaveBeenCalled();
    await statusChecker();

    expect(updateStatusMock).toHaveBeenCalledTimes(1);
    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'expectedPodName',
      namespace: 'expectedNamespace',
      status: 'unavailable',
      type: 'expectedType',
    });
  });
});
