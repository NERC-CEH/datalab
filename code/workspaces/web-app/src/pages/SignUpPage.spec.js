import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SignUpPage from './SignUpPage';

describe('SignUpPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SignUpPage />)).toMatchSnapshot();
  });
});
