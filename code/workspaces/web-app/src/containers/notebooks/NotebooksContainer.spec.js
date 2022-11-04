import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import NotebooksContainer from './NotebooksContainer';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import assetRepoActions from '../../actions/assetRepoActions';

jest.mock('react-redux');
jest.mock('../stacks/StacksContainer', () => props => (<>stacks container {JSON.stringify(props)}</>));
jest.mock('../../components/notebooks/EditNotebookForm', () => () => (<>notebook form</>));
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../actions/assetRepoActions');

const testProjKey = { fetching: false, error: null, value: 'test-proj' };

describe('NotebooksContainer', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useCurrentProjectKey.mockReturnValue(testProjKey);
    assetRepoActions.loadVisibleAssets.mockReturnValue({});
  });

  it('renders correctly passing correct props to children', () => {
    expect(render(<NotebooksContainer userPermissions={['expectedPermission']}/>).container).toMatchSnapshot();
  });
});
