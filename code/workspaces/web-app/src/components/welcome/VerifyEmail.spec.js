import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import VerifyEmail from './VerifyEmail';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');
getAuth.mockImplementation(() => ({
  login: jest.fn().mockName('login'),
}));

describe('VerifyEmail', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<VerifyEmail />)).toMatchSnapshot();
  });
});
