import logger from 'winston';
import { podAddedWatcher, podDeletedWatcher, podReadyWatcher } from './kubeWatcher';

jest.mock('winston');

describe('Kubernetes event watcher', () => {
  beforeEach(() => {
    logger.clearMessages();
  });

  it('podAddedWatcher logs events', () => {
    podAddedWatcher();

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podAddedWatcher logs events', () => {
    podDeletedWatcher();

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });

  it('podReadyWatcher logs events', () => {
    const event = generatePodEvent();

    podReadyWatcher(event);

    expect(logger.getDebugMessages()).toMatchSnapshot();
  });
});

const generatePodEvent = () => ({
  status: {
    phase: 'Running',
    conditions: [
      { type: 'Ready', status: 'True' },
    ],
  },
  metadata: {
    deletionTimestamp: undefined,
  },
});
