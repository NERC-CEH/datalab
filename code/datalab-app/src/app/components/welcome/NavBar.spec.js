import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import NavBar from './NavBar';

describe('NavBar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<NavBar />)).toMatchSnapshot();
  });
});
