import React from 'react';
import { render } from '@testing-library/react';
import HeroBar from './HeroBar';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');

beforeEach(() => {
  getAuth.mockImplementation(() => ({
    login: jest.fn(),
    selfServiceSignUp: jest.fn(),
    signUpConfig: jest.fn().mockReturnValue({ selfService: true }),
  }));
});

describe('HeroBar', () => {
  it('renders correct snapshot', () => {
    expect(render(<HeroBar />).container).toMatchSnapshot();
  });
});
