import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import VerifyEmail from './VerifyEmail';

jest.mock('../../auth/auth');

describe('VerifyEmail', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<VerifyEmail />)).toMatchSnapshot();
  });
});
