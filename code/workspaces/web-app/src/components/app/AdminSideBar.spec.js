import React from 'react';
import { shallow } from 'enzyme';
import AdminSideBar from './AdminSideBar';

const classes = {
  itemList: 'itemList',
  sideBar: 'sideBar',
};

describe('AdminSideBar', () => {
  it('renders correctly passing props to children', () => {
    const props = { classes };
    expect(shallow(<AdminSideBar {...props} />)).toMatchSnapshot();
  });
});
