import logger from 'winston';
import { podAddedWatcher, podDeletedWatcher, podReadyWatcher } from './kubeWatcher';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('winston');
jest.mock('../dataaccess/stacksRepository');

const updateStatusMock = jest.fn().mockReturnValue(Promise.resolve());

stackRepository.default = {
  updateStatus: updateStatusMock,
};

describe('Kubernetes event watcher', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();
  });

  it('podAddedWatcher logs events', () => {
    const event = generatePodEvent();

    return podAddedWatcher(event)
      .then(() => expect(logger.getDebugMessages()).toMatchSnapshot());
  });

  it('podAddedWatcher updates pod status', () => {
    const event = generatePodEvent();

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock)
        .toHaveBeenCalledWith({
          name: 'expectedName',
          status: 'creating',
          type: 'expectedType',
        }));
  });

  it('podDeletedWatcher logs events', () => {
    const event = generatePodEvent();

    podDeletedWatcher(event);

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher logs events', () => {
    const event = generatePodEvent();

    return podReadyWatcher(event)
      .then(() => expect(logger.getDebugMessages()).toMatchSnapshot());
  });

  it('podReadyWatcher updates pod status', () => {
    const event = generatePodEvent();

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podReadyWatcher(event)
      .then(() => expect(updateStatusMock)
        .toHaveBeenCalledWith({
          name: 'expectedName',
          status: 'ready',
          type: 'expectedType',
        }));
  });

  it('podReadyWatcher uses correct name when updating pod status', () => {
    const event = generatePodEvent('expectedType-expectedName', 'expectedType');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podReadyWatcher(event)
      .then(() => expect(updateStatusMock)
        .toHaveBeenCalledWith({
          name: 'expectedName',
          status: 'ready',
          type: 'expectedType',
        }));
  });
});

const generatePodEvent = (name = 'expectedName', type = 'expectedType') => ({
  status: {
    phase: 'Running',
    conditions: [
      { type: 'Ready', status: 'True' },
    ],
  },
  metadata: {
    labels: {
      name,
      'user-pod': type,
    },
    deletionTimestamp: undefined,
  },
});
