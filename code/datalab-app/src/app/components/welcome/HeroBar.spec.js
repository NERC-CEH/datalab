import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import HeroBar from './HeroBar';
import getAuth from '../../auth/auth';

jest.mock('../../auth/auth');
getAuth.mockImplementation(() => ({
  login: jest.fn(),
  signUp: jest.fn(),
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
