import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { reset } from 'redux-form';
import ProjectClustersContainer, { confirmScaleCluster, getDialogProps } from './ProjectClustersContainer';
import notify from '../../components/common/notify';

import * as mockAuthHooks from '../../hooks/authHooks';
import * as mockDataStorageHooks from '../../hooks/dataStorageHooks';
import * as mockClustersHooks from '../../hooks/clustersHooks';
import * as mockCluster from '../../config/clusters';
import mockModalDialogActions from '../../actions/modalDialogActions';
import mockClusterActions from '../../actions/clusterActions';
import mockDataStorageActions from '../../actions/dataStorageActions';
import mockAssetRepoActions from '../../actions/assetRepoActions';

jest.mock('redux-form', () => ({ reset: jest.fn().mockName('reset') }));
jest.mock('react-redux');
jest.mock('../../components/common/notify', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('../../components/stacks/StackCards', () => props => (<>StackCards {JSON.stringify(props, null, 2)}</>));
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('../../hooks/clustersHooks');
jest.mock('../../config/clusters');
jest.mock('../../actions/modalDialogActions');
jest.mock('../../actions/clusterActions');
jest.mock('../../actions/assetRepoActions');

const mockLoadClustersAction = jest.fn();
const mockCreateClusterAction = jest.fn();
const mockCloseModalDialogAction = jest.fn();
const mockOpenModalDialogAction = jest.fn();
const mockLoadDataStorage = jest.fn();
const mockLoadVisibleAssets = jest.fn();

const setMocks = () => {
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
  mockCluster.getCondaRequired.mockReturnValue(true);
  mockClusterActions.loadClusters = mockLoadClustersAction;
  mockClusterActions.createCluster = mockCreateClusterAction;
  mockModalDialogActions.closeModalDialog = mockCloseModalDialogAction;
  mockModalDialogActions.openModalDialog = mockOpenModalDialogAction;
  mockDataStorageActions.loadDataStorage = mockLoadDataStorage;
  mockAssetRepoActions.loadVisibleAssets = mockLoadVisibleAssets;
};

const copyMock = {
  Python: () => {},
};

beforeEach(() => {
  useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
});

describe('ProjectClustersContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMocks();
  });

  it('renders correct snapshot for all clusters', () => {
    const wrapper = render(<ProjectClustersContainer projectKey="project-key" userPermissions={[]} modifyData copySnippets={copyMock}/>);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders correct snapshot for Dask clusters', () => {
    const wrapper = render(<ProjectClustersContainer clusterType="DASK" projectKey="project-key" userPermissions={[]} modifyData copySnippets={copyMock}/>);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders correct snapshot for Spark clusters', () => {
    mockClustersHooks.useClustersByType.mockImplementationOnce(type => ({
      fetching: false,
      value: [
        {
          name: 'test-spark-cluster',
          type,
          displayName: 'Test Spark Cluster',
          schedulerAddress: 'spark://spark-scheduler-test-cluster:7077',
          projectKey: 'project-key',
        },
      ],
    }));

    const wrapper = render(<ProjectClustersContainer clusterType="SPARK" projectKey="project-key" userPermissions={[]} modifyData copySnippets={copyMock}/>);
    expect(wrapper.container).toMatchSnapshot();
  });
});

describe('getDialogProps', () => {
  let mockDispatch;
  const projectKey = 'testproj';
  const clusterType = 'DASK';
  const dataStores = [];

  beforeEach(() => {
    jest.clearAllMocks();
    setMocks();
    mockDispatch = jest.fn().mockName('dispatch').mockImplementation(value => value);
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

describe('confirmScaleCluster', () => {
  const dispatch = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('scales cluster up when existing status is suspended', async () => {
    const cluster = {
      status: 'suspended',
      displayName: 'cluster-name',
    };

    await confirmScaleCluster(dispatch)(cluster);

    expect(notify.success).toHaveBeenCalledWith('Cluster started');
    expect(notify.error).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it('notifies on error if scale up fails', async () => {
    dispatch.mockImplementationOnce(() => { throw Error('Expected test error'); });
    const cluster = {
      status: 'suspended',
      displayName: 'cluster-name',
    };

    await confirmScaleCluster(dispatch)(cluster);

    expect(notify.success).not.toHaveBeenCalled();
    expect(notify.error).toHaveBeenCalledWith('Unable to scale cluster');
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it('scales cluster down when existing status is not suspended', async () => {
    setMocks();
    const cluster = {
      status: 'ready',
      displayName: 'cluster-name',
    };

    await confirmScaleCluster(dispatch)(cluster);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockOpenModalDialogAction).toHaveBeenCalledWith(
      'MODAL_TYPE_SCALE_STACK',
      {
        title: 'Suspend cluster-name cluster?',
        body: 'Would you like to suspend the cluster-name cluster?',
        onSubmit: expect.any(Function),
        onCancel: expect.any(Function),
      },
    );
  });
});
