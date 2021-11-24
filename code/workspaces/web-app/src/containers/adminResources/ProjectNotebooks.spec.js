import React from 'react';
import { render } from '@testing-library/react';
import ProjectNotebooks from './ProjectNotebooks';

jest.mock('./ProjectNotebooksContainer', () => props => (<>ProjectNotebooksContainer Mock {JSON.stringify(props)}</>));

describe('ProjectNotebooks', () => {
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
    expect(render(<ProjectNotebooks {...props} />).container).toMatchSnapshot();
  });
});
