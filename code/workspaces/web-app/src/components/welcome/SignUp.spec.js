import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SignUp from './SignUp';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');

beforeEach(() => {
  getAuth.mockImplementation(() => ({
    signUpConfig: jest.fn().mockReturnValue({ requestEmail: 'test@test.com' }),
  }));
});

describe('SignUp', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SignUp />)).toMatchSnapshot();
  });
});
