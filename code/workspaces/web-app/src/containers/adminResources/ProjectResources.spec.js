import React from 'react';
import { shallow } from 'enzyme';
import ProjectResources from './ProjectResources';

describe('ProjectResources', () => {
  const shallowRender = (notebooks, sites, storage) => {
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['some-permission'],
    };
    const project = {
      key: 'testproj',
      name: 'Test Project',
    };
    const show = {
      notebooks,
      sites,
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
    expect(shallowRender(true, false, false)).toMatchSnapshot();
  });

  it('shows sites', () => {
    expect(shallowRender(false, true, false)).toMatchSnapshot();
  });

  it('shows storage', () => {
    expect(shallowRender(false, false, true)).toMatchSnapshot();
  });
});
