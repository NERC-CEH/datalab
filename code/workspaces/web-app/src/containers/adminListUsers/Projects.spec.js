import React from 'react';
import { shallow } from 'enzyme';
import { PureProjects as Projects } from './Projects';

describe('Projects', () => {
  const shallowRender = () => {
    const projects = [{
      id: 'test-id',
      key: 'test-key',
      name: 'Test Name',
      description: 'test description',
      accessible: 'test accessible',
    }];
    const props = {
      projects,
    };

    return shallow(<Projects {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
