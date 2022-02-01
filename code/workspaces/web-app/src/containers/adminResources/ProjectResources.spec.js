import React from 'react';
import { render } from '../../testUtils/renderTests';
import ProjectResources from './ProjectResources';

jest.mock('./ProjectNotebooks', () => props => (<>ProjectNotebooks Mock {JSON.stringify(props)}</>));
jest.mock('./ProjectSites', () => props => (<>ProjectSites Mock {JSON.stringify(props)}</>));
jest.mock('./ProjectClusters', () => props => (<>ProjectClusters Mock {JSON.stringify(props)}</>));
jest.mock('./ProjectStorage', () => props => (<>ProjectStorage Mock {JSON.stringify(props)}</>));

describe('ProjectResources', () => {
  const renderResources = (notebooks, sites, clusters, storage) => {
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['some-permission'],
    };
    const project = {
      key: 'test-project',
      name: 'Test Project',
    };
    const show = {
      notebooks,
      sites,
      clusters,
      storage,
    };
    const props = {
      promisedUserPermissions,
      project,
      show,
    };

    return render(<ProjectResources {...props} />).container;
  };

  it('shows notebooks', () => {
    expect(renderResources(true, false, false, false)).toMatchSnapshot();
  });

  it('shows sites', () => {
    expect(renderResources(false, true, false, false)).toMatchSnapshot();
  });

  it('shows clusters', () => {
    expect(renderResources(false, false, true, false)).toMatchSnapshot();
  });

  it('shows storage', () => {
    expect(renderResources(false, false, false, true)).toMatchSnapshot();
  });
});
