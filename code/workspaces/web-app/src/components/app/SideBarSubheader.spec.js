import React from 'react';
import { render } from '@testing-library/react';
import SideBarSubheader from './SideBarSubheader';

describe('SideBarSubheader', () => {
  it('renders correct snapshot', () => {
    const wrapper = render(<SideBarSubheader>{'expectedChild'}</SideBarSubheader>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
