import React from 'react';
import { render } from '@testing-library/react';
import ProjectSites from './ProjectSites';

jest.mock('./ProjectSitesContainer', () => props => (<>ProjectSitesContainer Mock {JSON.stringify(props)}</>));

describe('ProjectSites', () => {
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
    expect(render(<ProjectSites {...props} />).container).toMatchSnapshot();
  });
});
