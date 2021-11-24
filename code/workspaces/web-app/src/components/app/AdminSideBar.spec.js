import React from 'react';
import { render } from '@testing-library/react';
import AdminSideBar from './AdminSideBar';

jest.mock('./SideBarButton', () => props => (<div>SideBarButton mock {JSON.stringify(props)}</div>));

const classes = {
  itemList: 'itemList',
  sideBar: 'sideBar',
};

describe('AdminSideBar', () => {
  it('renders correctly passing props to children', () => {
    const props = { classes };
    expect(render(<AdminSideBar {...props} />).container).toMatchSnapshot();
  });
});
