import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import ClustersContainer from './ClustersContainer';

import * as mockAuthHooks from '../../hooks/authHooks';
import * as mockCurrentProjectHooks from '../../hooks/currentProjectHooks';
import * as mockDataStorageHooks from '../../hooks/dataStorageHooks';
import * as mockClustersHooks from '../../hooks/clustersHooks';
import * as mockCluster from '../../config/clusters';

jest.mock('redux-form', () => ({ reset: jest.fn().mockName('reset') }));
jest.mock('react-redux');
jest.mock('../../components/common/notify', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('../../hooks/clustersHooks');
jest.mock('../../config/clusters');

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

mockAuthHooks.useCurrentUserId.mockReturnValue({ value: 'test-user' });
mockAuthHooks.useCurrentUserPermissions.mockReturnValue([]);
mockCurrentProjectHooks.useCurrentProjectKey.mockReturnValue({ value: 'current-project' });
mockDataStorageHooks.useDataStorageForUserInProject.mockReturnValue({ value: [{ name: 'test-store' }] });
mockClustersHooks.useClustersByType.mockImplementation(type => ({
  fetching: false,
  value: [{
    name: 'test-cluster',
    type,
    displayName: 'Test Cluster',
    schedulerAddress: 'tcp://dask-scheduler-test-cluster:8786',
    projectKey: 'current-project',
  }],
}));

mockCluster.getClusterMaxWorkers.mockReturnValue({ lowerLimit: 1, default: 4, upperLimit: 8 });
mockCluster.getWorkerMemoryMax.mockReturnValue({ lowerLimit: 0.5, default: 4, upperLimit: 8 });
mockCluster.getWorkerCpuMax.mockReturnValue({ lowerLimit: 0.5, default: 0.5, upperLimit: 2 });

const copyMock = {
  Python: () => {},
};

describe('ClustersContainer', () => {
  const getShallowRender = () => shallow(<ClustersContainer clusterType="DASK" copySnippets={copyMock}/>);

  it('renders correct snapshot', () => {
    expect(getShallowRender()).toMatchSnapshot();
  });
});
