import logger from '../config/logger';
import { podAddedWatcher, podDeletedWatcher, podReadyWatcher } from './kubeWatcher';
import * as stackRepository from '../dataaccess/stacksRepository';

jest.mock('../config/logger');
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
    const event = creatingPodEvent('jupyter-expectedName', 'jupyter');

    return podAddedWatcher(event)
      .then(() => {
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getInfoMessages()).toMatchSnapshot();
      });
  });

  it('podAddedWatcher updates pod status', () => {
    const event = creatingPodEvent('jupyter-expectedName', 'jupyter');

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
    const event = creatingPodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock).not.toHaveBeenCalled());
  });

  it('podAddedWatcher does not call update if Pod is running', () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock).not.toHaveBeenCalled());
  });


  it('podDeletedWatcher logs events', () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    podDeletedWatcher(event);

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher logs events', () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    return podReadyWatcher(event)
      .then(() => {
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getInfoMessages()).toMatchSnapshot();
      });
  });

  it('podReadyWatcher updates pod status', () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

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
    const event = readyPodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    return podAddedWatcher(event)
      .then(() => expect(updateStatusMock).not.toHaveBeenCalled());
  });
});

const readyPodEvent = (name, type) => ({
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

const creatingPodEvent = (name, type) => ({
  status: {
    phase: 'Pending',
    conditions: [
      { type: 'Pending', status: 'True' },
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
