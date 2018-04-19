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
];

getStacksMock.mockReturnValue(Promise.resolve(stacks));
updateStatusMock.mockReturnValue(Promise.resolve());

describe('Stack Status Checker', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();
  });

  it('calls stack repository update with correct status', () =>
    statusChecker().then(() =>
      expect(updateStatusMock.mock.calls).toMatchSnapshot()));
});
