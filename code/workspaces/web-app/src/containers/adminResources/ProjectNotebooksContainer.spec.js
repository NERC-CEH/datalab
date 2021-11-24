import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '@testing-library/react';
import ProjectNotebooksContainer from './ProjectNotebooksContainer';

jest.mock('react-redux');
useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

jest.mock('../stacks/StacksContainer', () => ({
  ProjectStacksContainer: props => (<>project stacks container {JSON.stringify(props, null, 2)}</>),
}));
jest.mock('../../components/notebooks/EditNotebookForm', () => () => (<>notebook form</>));

describe('ProjectNotebooksContainer', () => {
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

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<ProjectNotebooksContainer {...props} />).container).toMatchSnapshot();
  });
});
