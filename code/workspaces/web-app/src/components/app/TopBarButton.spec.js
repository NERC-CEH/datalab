import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import TopBarButton from './TopBarButton';

describe('TopBarButton', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('correctly passes props to wrapped component', () => {
    expect(
      shallow(<TopBarButton label='Test Label' to='/testendpoint'/>),
    ).toMatchSnapshot();
  });
});
