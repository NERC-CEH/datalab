import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import DaskPage from './DaskPage';

import * as mockAuthHooks from '../hooks/authHooks';
import * as mockCurrentProjectHooks from '../hooks/currentProjectHooks';
import * as mocDataStorageHooks from '../hooks/dataStorageHooks';
import * as mockCluster from '../config/clusters';
import mockModalDialogActions from '../actions/modalDialogActions';

jest.mock('react-redux');
jest.mock('../hooks/authHooks');
jest.mock('../hooks/currentProjectHooks');
jest.mock('../hooks/dataStorageHooks');
jest.mock('../config/clusters');
jest.mock('../actions/modalDialogActions');

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

mockAuthHooks.useCurrentUserId.mockReturnValue({ value: 'test-user' });
mockCurrentProjectHooks.useCurrentProjectKey.mockReturnValue({ value: 'current-project' });
mocDataStorageHooks.useDataStorageForUserInProject.mockReturnValue({ value: [{ name: 'test-store' }] });

mockCluster.getClusterMaxWorkers.mockReturnValue({ lowerLimit: 1, default: 4, upperLimit: 8 });
mockCluster.getWorkerMemoryMax.mockReturnValue({ lowerLimit: 0.5, default: 4, upperLimit: 8 });
mockCluster.getWorkerCpuMax.mockReturnValue({ lowerLimit: 0.5, default: 0.5, upperLimit: 2 });

describe('DaskPage', () => {
  it('renders correct snapshot', () => {
    expect(shallow(<DaskPage />)).toMatchSnapshot();
  });

  describe('Create Dask Cluster Button', () => {
    it('calls to open create cluster modal dialog with correct props', () => {
      const render = shallow(<DaskPage />);
      const buttonRender = render.find('#create-button');
      const onClick = buttonRender.prop('onClick');

      onClick();

      expect(mockModalDialogActions.openModalDialog.mock.calls[0]).toMatchSnapshot();
    });
  });
});
