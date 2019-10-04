import logger from '../config/logger';
import statusChecker from './stackStatusChecker';
import * as podsApi from '../kubernetes/podsApi';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('../config/logger');
jest.mock('../kubernetes/podsApi');
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

getStacksMock.mockReturnValue(Promise.resolve(stacks));
updateStatusMock.mockReturnValue(Promise.resolve({ n: 1 }));

describe('Stack Status Checker', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();
  });

  it('updates stack records with correct status', () => statusChecker().then(() => expect(updateStatusMock.mock.calls).toMatchSnapshot()));

  it('updates stack record for Running stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Running', namespace: 'expectedNamespace' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        namespace: 'expectedNamespace',
        status: 'ready',
        type: 'expectedType',
      });
    });
  });

  it('updates stack record for Requested stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Pending', namespace: 'expectedNamespace' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        namespace: 'expectedNamespace',
        status: 'requested',
        type: 'expectedType',
      });
    });
  });

  it('updates stack record for Creating stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'CrashLoopBackOff', namespace: 'expectedNamespace' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        namespace: 'expectedNamespace',
        status: 'unavailable',
        type: 'expectedType',
      });
    });
  });
});
