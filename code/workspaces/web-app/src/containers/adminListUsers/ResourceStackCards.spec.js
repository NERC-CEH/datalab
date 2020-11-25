import React from 'react';
import { shallow } from 'enzyme';
import ResourceStackCards from './ResourceStackCards';

describe('ResourceStackCards', () => {
  const shallowRender = () => {
    const resources = [{
      key: 'test-key',
      name: 'Test Name',
    }];
    const typeName = 'some resource';
    const typeNamePlural = 'some resources';
    const props = {
      resources, typeName, typeNamePlural,
    };

    return shallow(<ResourceStackCards {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
