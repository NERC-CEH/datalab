import React from 'react';
import { shallow } from 'enzyme';
import DataStores from './DataStores';

describe('DataStores', () => {
  const shallowRender = () => {
    const dataStores = [{
      key: 'test-key',
      name: 'Test Name',
    }];
    const props = {
      dataStores,
    };

    return shallow(<DataStores {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
