import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import SitesContainer from './SitesContainer';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';

jest.mock('react-redux');
jest.mock('../stacks/StacksContainer', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>stacks container</>),
}));
jest.mock('../../components/sites/EditSiteForm', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>site form</>),
}));
jest.mock('../../hooks/currentProjectHooks');

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
const testProjKey = { fetching: false, error: null, value: 'test-proj' };
useCurrentProjectKey.mockReturnValue(testProjKey);

describe('SitesContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<SitesContainer userPermissions={['expectedPermission']}/>)).toMatchSnapshot();
  });
});
