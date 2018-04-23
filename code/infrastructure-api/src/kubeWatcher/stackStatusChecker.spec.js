import logger from 'winston';
import statusChecker from './stackStatusChecker';
import * as podsApi from '../kubernetes/podsApi';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('winston');
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
  { name: 'expectedType-firstPod', status: 'Evicted' },
  { name: 'expectedType-firstPod', status: 'Running' },
  { name: 'expectedType-secondPod', status: 'Running' },
  { name: 'expectedType-thirdPod', status: 'Terminating' },
  { name: 'expectedType-fourthPod', status: 'Init:0/2' },
];

getStacksMock.mockReturnValue(Promise.resolve(stacks));
updateStatusMock.mockReturnValue(Promise.resolve());

describe('Stack Status Checker', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();
  });

  it('updates stack records with correct status', () =>
    statusChecker().then(() =>
      expect(updateStatusMock.mock.calls).toMatchSnapshot()));

  it('updates stack record for Running stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Running' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        status: 'ready',
        type: 'expectedType',
      });
    });
  });

  it('updates stack record for Creating stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'Pending' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        status: 'creating',
        type: 'expectedType',
      });
    });
  });

  it('updates stack record for Creating stack', () => {
    getStacksMock.mockReturnValue(Promise.resolve([
      { name: 'expectedType-expectedPodName', status: 'CrashLoopBackOff' },
    ]));

    expect(updateStatusMock).not.toHaveBeenCalled();
    return statusChecker().then(() => {
      expect(updateStatusMock).toHaveBeenCalledTimes(1);
      expect(updateStatusMock).toHaveBeenCalledWith({
        name: 'expectedPodName',
        status: 'unavailable',
        type: 'expectedType',
      });
    });
  });
});
