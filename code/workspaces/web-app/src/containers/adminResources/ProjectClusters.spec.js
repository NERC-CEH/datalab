import React from 'react';
import { render } from '../../testUtils/renderTests';
import ProjectClusters from './ProjectClusters';

jest.mock('../clusters/ProjectClustersContainer', () => props => (<>ProjectClustersContainer Mock {JSON.stringify(props)}</>));

describe('ProjectClusters', () => {
  const promisedUserPermissions = {
    fetching: false,
    error: null,
    value: ['some-permission'],
  };
  const project = {
    key: 'test-project',
    name: 'Test Project',
  };
  const props = {
    promisedUserPermissions,
    project,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<ProjectClusters {...props} />).container).toMatchSnapshot();
  });
});
