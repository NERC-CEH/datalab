import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SideBarButton from './SideBarButton';

describe('SideBarButton', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('correctly passes props to wrapped component', () => {
    expect(
      shallow(<SideBarButton label='Test Label' to='/testendpoint'/>),
    ).toMatchSnapshot();
  });
});
