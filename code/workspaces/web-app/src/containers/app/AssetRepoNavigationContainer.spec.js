import React from 'react';
import { shallow } from 'enzyme';
import AssetRepoNavigationContainer from './AssetRepoNavigationContainer';

describe('AssetRepoNavigationContainer', () => {
  const shallowRender = () => shallow(<AssetRepoNavigationContainer />);

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
