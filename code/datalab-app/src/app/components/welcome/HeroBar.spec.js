import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import HeroBar from './HeroBar';
import auth from '../../auth/auth';

jest.mock('../../auth/auth');
auth.mockImplementation(() => ({
  login: jest.fn(),
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
