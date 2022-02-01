import React from 'react';
import { render } from '../../testUtils/renderTests';
import ProjectStorage from './ProjectStorage';

jest.mock('../dataStorage/DataStorageContainer', () => ({
  ProjectDataStorageContainer: props => (<>DataStorageContainer Mock {JSON.stringify(props)}</>),
}));

describe('ProjectStorage', () => {
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
    expect(render(<ProjectStorage {...props} />).container).toMatchSnapshot();
  });
});
