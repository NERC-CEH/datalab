import logger from '../config/logger';
import { podAddedWatcher, podDeletedWatcher, podReadyWatcher } from './kubeWatcher';
import * as stackRepository from '../dataaccess/stacksRepository';
import * as clustersRepository from '../dataaccess/clustersRepository';

jest.mock('../config/logger');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../dataaccess/clustersRepository');

const updateStatusMock = jest.fn();
const updateClusterStatusMock = jest.fn();

stackRepository.default = {
  updateStatus: updateStatusMock,
};

clustersRepository.default = {
  updateStatus: updateClusterStatusMock,
};

describe('Kubernetes event watcher', () => {
  beforeEach(() => {
    logger.clearMessages();
    jest.clearAllMocks();

    updateStatusMock.mockReturnValue(Promise.resolve());
    updateClusterStatusMock.mockReturnValue(Promise.resolve());
  });

  it('podAddedWatcher logs events', async () => {
    const event = creatingPodEvent('jupyter-expectedName', 'jupyter');

    await podAddedWatcher(event);
    expect(logger.getDebugMessages()).toMatchSnapshot();
    expect(logger.getInfoMessages()).toMatchSnapshot();
  });

  it('podAddedWatcher updates pod status', async () => {
    const event = creatingPodEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    await podAddedWatcher(event);
    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'expectedName',
      status: 'creating',
      type: 'jupyter',
    });
  });

  it('podAddedWatcher updates cluster pod status', async () => {
    const event = creatingPodEvent('DASK-expectedName', 'dask');

    expect(updateClusterStatusMock).not.toHaveBeenCalled();

    await podAddedWatcher(event);
    expect(updateClusterStatusMock).toHaveBeenCalledWith({
      name: 'expectedName',
      status: 'creating',
      type: 'DASK',
    });
  });

  it('podAddedWatcher does not call update for minio', async () => {
    const event = creatingPodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    await podAddedWatcher(event);
    expect(updateStatusMock).not.toHaveBeenCalled();
  });

  it('podAddedWatcher does not call update if Pod is running', async () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    await podAddedWatcher(event);
    expect(updateStatusMock).not.toHaveBeenCalled();
  });

  it('podDeletedWatcher logs events', () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    podDeletedWatcher(event);

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher logs events', async () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    await podReadyWatcher(event);
    expect(logger.getDebugMessages()).toMatchSnapshot();
    expect(logger.getInfoMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher updates pod status', async () => {
    const event = readyPodEvent('jupyter-expectedName', 'jupyter');

    expect(updateStatusMock).not.toHaveBeenCalled();

    await podReadyWatcher(event);
    expect(updateStatusMock).toHaveBeenCalledWith({
      name: 'expectedName',
      status: 'ready',
      type: 'jupyter',
    });
  });

  it('podReadyWatcher does not call update for minio', async () => {
    const event = readyPodEvent('minio-expectedName', 'minio');

    expect(updateStatusMock).not.toHaveBeenCalled();

    await podAddedWatcher(event);
    expect(updateStatusMock).not.toHaveBeenCalled();
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
