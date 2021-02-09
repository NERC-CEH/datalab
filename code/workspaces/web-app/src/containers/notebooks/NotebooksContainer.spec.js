import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import NotebooksContainer from './NotebooksContainer';

jest.mock('react-redux');
jest.mock('../stacks/StacksContainer', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>stacks container</>),
}));
jest.mock('../../components/notebooks/EditNotebookForm', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>notebook form</>),
}));

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

describe('NotebooksContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<NotebooksContainer userPermissions={['expectedPermission']}/>)).toMatchSnapshot();
  });
});
