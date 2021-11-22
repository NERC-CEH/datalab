import React from 'react';
import { render } from '@testing-library/react';
import VerifyEmailPage from './VerifyEmailPage';

jest.mock('../components/welcome/VerifyEmail', () => () => (<div>VerifyEmail mock</div>));

describe('VerifyEmailPage', () => {
  it('renders correct snapshot', () => {
    expect(render(<VerifyEmailPage />).container).toMatchSnapshot();
  });
});
