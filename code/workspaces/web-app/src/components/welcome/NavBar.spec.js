import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './NavBar';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');
beforeEach(() => {
  getAuth.mockImplementation(() => ({
    login: jest.fn(),
  }));
});

describe('NavBar', () => {
  it('renders correct snapshot', () => {
    expect(render(<NavBar />).container).toMatchSnapshot();
  });
});
