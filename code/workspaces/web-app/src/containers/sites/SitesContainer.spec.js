import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import SitesContainer from './SitesContainer';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import assetRepoActions from '../../actions/assetRepoActions';

jest.mock('react-redux');
jest.mock('../stacks/StacksContainer', () => props => (<>stacks container {JSON.stringify(props)}</>));
jest.mock('../../components/sites/EditSiteForm', () => () => (<>site form</>));
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../actions/assetRepoActions');

const testProjKey = { fetching: false, error: null, value: 'test-proj' };

describe('SitesContainer', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useCurrentProjectKey.mockReturnValue(testProjKey);
    assetRepoActions.loadVisibleAssets.mockReturnValue({});
  });

  it('renders correctly passing correct props to children', () => {
    expect(render(<SitesContainer userPermissions={['expectedPermission']}/>).container).toMatchSnapshot();
  });
});
