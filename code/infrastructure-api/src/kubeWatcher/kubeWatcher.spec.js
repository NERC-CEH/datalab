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
    const event = generatePodAdditionEvent('jupyter-expectedName', 'jupyter');

    return podAddedWatcher(event)
      .then(() => expect(logger.getDebugMessages()).toMatchSnapshot());
  });

  it('podAddedWatcher updates pod status', () => {
    const event = generatePodAdditionEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock)
        .toHaveBeenCalledWith({
          name: 'expectedName',
          status: 'creating',
          type: 'jupyter',
        }));
  });

  it('podAddedWatcher does not call update for minio', () => {
    const event = generatePodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock).not.toHaveBeenCalled());
  });

  it('podDeletedWatcher logs events', () => {
    const event = generatePodEvent('jupyter-expectedName', 'jupyter');

    podDeletedWatcher(event);

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher logs events', () => {
    const event = generatePodEvent('jupyter-expectedName', 'jupyter');

    return podReadyWatcher(event)
      .then(() => expect(logger.getDebugMessages()).toMatchSnapshot());
  });

  it('podReadyWatcher updates pod status', () => {
    const event = generatePodEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podReadyWatcher(event)
      .then(() => expect(updateStatusMock)
        .toHaveBeenCalledWith({
          name: 'expectedName',
          status: 'ready',
          type: 'jupyter',
        }));
  });

  it('podReadyWatcher does not call update for minio', () => {
    const event = generatePodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock).not.toHaveBeenCalled());
  });
});

const generatePodEvent = (name, type) => ({
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

const generatePodAdditionEvent = (name, type) => ({
  status: {
    phase: 'Pending',
  },
  metadata: {
    labels: {
      name,
      'user-pod': type,
    },
    deletionTimestamp: undefined,
  },
});
