import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SideBarSubheader from './SideBarSubheader';

describe('SideBarSubheader', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SideBarSubheader>{'expectedChild'}</SideBarSubheader>)).toMatchSnapshot();
  });
});
