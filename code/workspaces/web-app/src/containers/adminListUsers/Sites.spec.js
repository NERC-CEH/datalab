import React from 'react';
import { shallow } from 'enzyme';
import Sites from './Sites';

describe('Sites', () => {
  const shallowRender = () => {
    const sites = [{
      key: 'test-key',
      name: 'Test Name',
    }];
    const props = {
      sites,
    };

    return shallow(<Sites {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
