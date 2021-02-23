import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import VerifyEmail from './VerifyEmail';
import { getAuth } from '../../config/authConfig';

jest.mock('../../config/authConfig');
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
