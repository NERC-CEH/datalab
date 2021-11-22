import React from 'react';
import { render } from '@testing-library/react';
import SignUpPage from './SignUpPage';

jest.mock('../components/welcome/SignUp', () => () => (<div>SignUp mock</div>));

describe('SignUpPage', () => {
  it('renders correct snapshot', () => {
    expect(render(<SignUpPage />).container).toMatchSnapshot();
  });
});
