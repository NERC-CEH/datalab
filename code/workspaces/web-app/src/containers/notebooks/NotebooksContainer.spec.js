import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import NotebooksContainer from './NotebooksContainer';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';

jest.mock('react-redux');
jest.mock('../stacks/StacksContainer', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>stacks container</>),
}));
jest.mock('../../components/notebooks/EditNotebookForm', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>notebook form</>),
}));
jest.mock('../../hooks/currentProjectHooks');

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
const testProjKey = { fetching: false, error: null, value: 'test-proj' };
useCurrentProjectKey.mockReturnValue(testProjKey);

describe('NotebooksContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<NotebooksContainer userPermissions={['expectedPermission']}/>)).toMatchSnapshot();
  });
});
