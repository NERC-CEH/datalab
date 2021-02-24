import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import HeroBar from './HeroBar';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');
getAuth.mockImplementation(() => ({
  login: jest.fn(),
  selfServiceSignUp: jest.fn(),
  signUpConfig: jest.fn().mockReturnValue({ selfService: true }),
}));

describe('HeroBar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<HeroBar />)).toMatchSnapshot();
  });
});
