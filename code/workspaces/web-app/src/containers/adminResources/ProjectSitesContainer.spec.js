import React from 'react';
import { render } from '../../testUtils/renderTests';
import ProjectSitesContainer from './ProjectSitesContainer';

jest.mock('../stacks/StacksContainer', () => ({
  ProjectStacksContainer: props => (<>ProjectStacksContainer Mock {JSON.stringify(props, null, 2)}</>),
}));

describe('ProjectSitesContainer', () => {
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
    expect(render(<ProjectSitesContainer {...props} />).container).toMatchSnapshot();
  });
});
