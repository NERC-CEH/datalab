import React from 'react';
import { shallow } from 'enzyme';
import ProjectResources from './ProjectResources';

describe('ProjectResources', () => {
  const shallowRender = (notebooks, sites, clusters, storage) => {
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

    return shallow(<ProjectResources {...props} />);
  };

  it('shows notebooks', () => {
    expect(shallowRender(true, false, false, false)).toMatchSnapshot();
  });

  it('shows sites', () => {
    expect(shallowRender(false, true, false, false)).toMatchSnapshot();
  });

  it('shows clusters', () => {
    expect(shallowRender(false, false, true, false)).toMatchSnapshot();
  });

  it('shows storage', () => {
    expect(shallowRender(false, false, false, true)).toMatchSnapshot();
  });
});
