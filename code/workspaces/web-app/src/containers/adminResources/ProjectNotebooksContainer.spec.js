import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import ProjectNotebooksContainer from './ProjectNotebooksContainer';

jest.mock('react-redux');
useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

jest.mock('../stacks/StacksContainer', () => ({
  __esModule: true,
  ProjectStacksContainer: jest.fn().mockReturnValue(<>project stacks container</>),
}));
jest.mock('../../components/notebooks/EditNotebookForm', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>notebook form</>),
}));

describe('ProjectNotebooksContainer', () => {
  const shallowRender = () => {
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['some-permission'],
    };
    const project = {
      key: 'testproj',
      name: 'Test Project',
    };
    const props = {
      promisedUserPermissions,
      project,
    };

    return shallow(<ProjectNotebooksContainer {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
