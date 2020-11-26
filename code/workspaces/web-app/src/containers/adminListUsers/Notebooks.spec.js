import React from 'react';
import { shallow } from 'enzyme';
import Notebooks from './Notebooks';

describe('Notebooks', () => {
  const shallowRender = () => {
    const notebooks = [{
      key: 'test-key',
      name: 'Test Name',
    }];
    const props = {
      notebooks,
    };

    return shallow(<Notebooks {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
