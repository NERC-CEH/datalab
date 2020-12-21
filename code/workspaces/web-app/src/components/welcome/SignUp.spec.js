import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SignUp from './SignUp';
import getAuth from '../../auth/auth';

jest.mock('../../auth/auth');
getAuth.mockImplementation(() => ({
  signUpConfig: jest.fn().mockReturnValue({ requestEmail: 'test@test.com' }),
}));

describe('SignUp', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SignUp />)).toMatchSnapshot();
  });
});
