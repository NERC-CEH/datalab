import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import { reset } from 'redux-form';
import ProjectClustersContainer, { getDialogProps } from './ProjectClustersContainer';
import notify from '../../components/common/notify';

import * as mockAuthHooks from '../../hooks/authHooks';
import * as mockDataStorageHooks from '../../hooks/dataStorageHooks';
import * as mockClustersHooks from '../../hooks/clustersHooks';
import * as mockCluster from '../../config/clusters';
import mockModalDialogActions from '../../actions/modalDialogActions';
import mockClusterActions from '../../actions/clusterActions';

jest.mock('redux-form', () => ({ reset: jest.fn().mockName('reset') }));
jest.mock('react-redux');
jest.mock('../../components/common/notify', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('../../hooks/clustersHooks');
jest.mock('../../config/clusters');
jest.mock('../../actions/modalDialogActions');
jest.mock('../../actions/clusterActions');

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

mockAuthHooks.useCurrentUserId.mockReturnValue({ value: 'test-user' });
mockDataStorageHooks.useDataStorageForUserInProject.mockReturnValue({ value: [{ name: 'test-store' }] });
mockClustersHooks.useClustersByType.mockImplementation(type => ({
  fetching: false,
  value: [
    {
      name: 'test-cluster',
      type,
      displayName: 'Test Cluster',
      schedulerAddress: 'tcp://dask-scheduler-test-cluster:8786',
      projectKey: 'project-key',
    },
    {
      name: 'test-cluster2',
      type,
      displayName: 'Test Cluster2',
      schedulerAddress: 'tcp://dask-scheduler-test-cluster2:8786',
      projectKey: 'project-key2',
    },
  ],
}));

mockCluster.getClusterMaxWorkers.mockReturnValue({ lowerLimit: 1, default: 4, upperLimit: 8 });
mockCluster.getWorkerMemoryMax.mockReturnValue({ lowerLimit: 0.5, default: 4, upperLimit: 8 });
mockCluster.getWorkerCpuMax.mockReturnValue({ lowerLimit: 0.5, default: 0.5, upperLimit: 2 });

const mockLoadClustersAction = jest.fn();
const mockCreateClusterAction = jest.fn();
mockClusterActions.loadClusters = mockLoadClustersAction;
mockClusterActions.createCluster = mockCreateClusterAction;

const mockCloseModalDialogAction = jest.fn();
mockModalDialogActions.closeModalDialog = mockCloseModalDialogAction;

describe('ProjectClustersContainer', () => {
  const getShallowRender = () => shallow(<ProjectClustersContainer clusterType="DASK" projectKey="project-key" userPermissions={[]} showCreateButton />);

  it('renders correct snapshot', () => {
    expect(getShallowRender()).toMatchSnapshot();
  });
});

describe('getDialogProps', () => {
  const mockDispatch = jest.fn().mockName('dispatch').mockImplementation(value => value);
  const projectKey = 'testproj';
  const clusterType = 'DASK';
  const dataStores = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns object of props matching snapshot', () => {
    const props = getDialogProps(mockDispatch, projectKey, clusterType, dataStores);
    expect(props).toMatchSnapshot();
  });

  describe('creates onSubmit prop that', () => {
    const cluster = { name: 'test-cluster' };
    const getOnSubmit = () => getDialogProps(mockDispatch, projectKey, clusterType, dataStores).onSubmit;

    it('dispatches close modal dialog action', async () => {
      mockCloseModalDialogAction.mockReturnValueOnce('close-dialog');
      const onSubmit = getOnSubmit();

      await onSubmit(cluster);

      expect(mockDispatch).toHaveBeenCalledWith('close-dialog');
    });

    it('dispatches action to create cluster with correct arguments', async () => {
      mockCreateClusterAction.mockReturnValueOnce('create-cluster');
      const onSubmit = getOnSubmit();

      await onSubmit(cluster);

      expect(mockDispatch).toHaveBeenCalledWith('create-cluster');
      expect(mockCreateClusterAction).toHaveBeenCalledWith({ ...cluster, projectKey, type: clusterType });
    });

    describe('when cluster creation is successful', () => {
      beforeEach(() => {
        mockCreateClusterAction.mockReturnValueOnce('create-cluster');
      });

      it('notifies of success', async () => {
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(notify.success).toHaveBeenCalledWith('Cluster created');
        expect(notify.error).not.toHaveBeenCalled();
      });

      it('dispatched to reset form', async () => {
        reset.mockReturnValue('reset-form');
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(reset).toHaveBeenCalledWith('createCluster');
        expect(mockDispatch).toHaveBeenCalledWith('reset-form');
      });

      it('dispatches to reload the list of clusters for the project', async () => {
        mockLoadClustersAction.mockReturnValueOnce('load-clusters');
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(mockLoadClustersAction).toHaveBeenCalledWith(projectKey);
        expect(mockDispatch).toHaveBeenCalledWith('load-clusters');
      });
    });

    describe('when cluster create is unsuccessful', () => {
      beforeEach(() => {
        mockCreateClusterAction.mockRejectedValueOnce(new Error('expected test error'));
      });

      it('notifies of error if failure to create cluster', async () => {
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(notify.error).toHaveBeenCalledWith('Unable to create Cluster');
        expect(notify.success).not.toHaveBeenCalled();
      });

      it('does not dispatch to reset form', async () => {
        reset.mockReturnValue('reset-form');
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(reset).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith('reset-form');
      });

      it('does not dispatch to reload the list of clusters for the project', async () => {
        mockLoadClustersAction.mockReturnValueOnce('load-clusters');
        const onSubmit = getOnSubmit();

        await onSubmit(cluster);

        expect(mockLoadClustersAction).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith('load-clusters');
      });
    });
  });

  describe('creates onCancel prop that', () => {
    const getOnCancel = () => getDialogProps(mockDispatch, projectKey, clusterType, dataStores).onCancel;

    it('dispatches to close dialog', () => {
      mockCloseModalDialogAction.mockReturnValueOnce('close-modal');
      const onCancel = getOnCancel();

      onCancel();

      expect(mockCloseModalDialogAction).toHaveBeenCalledWith();
      expect(mockDispatch).toHaveBeenCalledWith('close-modal');
    });
  });
});
