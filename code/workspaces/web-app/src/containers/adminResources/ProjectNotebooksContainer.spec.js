import React from 'react';
import { shallow } from 'enzyme';
import ProjectNotebooksContainer from './ProjectNotebooksContainer';

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
