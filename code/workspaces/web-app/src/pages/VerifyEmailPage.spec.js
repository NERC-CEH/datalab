import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import VerifyEmailPage from './VerifyEmailPage';

describe('VerifyEmailPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<VerifyEmailPage />)).toMatchSnapshot();
  });
});
