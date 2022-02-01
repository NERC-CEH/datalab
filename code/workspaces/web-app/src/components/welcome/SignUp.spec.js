import React from 'react';
import { render } from '../../testUtils/renderTests';
import SignUp from './SignUp';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');

beforeEach(() => {
  getAuth.mockImplementation(() => ({
    signUpConfig: jest.fn().mockReturnValue({ requestEmail: 'test@test.com' }),
  }));
});

describe('SignUp', () => {
  it('renders correct snapshot', () => {
    expect(render(<SignUp />).container).toMatchSnapshot();
  });
});
