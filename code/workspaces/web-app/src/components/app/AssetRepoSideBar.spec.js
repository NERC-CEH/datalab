import React from 'react';
import { shallow } from 'enzyme';
import AssetRepoSideBar from './AssetRepoSideBar';

const classes = {
  itemList: 'itemList',
  sideBar: 'sideBar',
};

describe('AssetRepoSideBar', () => {
  it('renders correctly passing props to children', () => {
    const props = { classes };
    expect(shallow(<AssetRepoSideBar {...props} />)).toMatchSnapshot();
  });
});
