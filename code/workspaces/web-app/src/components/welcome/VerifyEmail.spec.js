import React from 'react';
import { render, fireEvent } from '../../testUtils/renderTests';
import VerifyEmail from './VerifyEmail';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');

describe('VerifyEmail', () => {
  const login = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getAuth.mockReturnValue({
      login,
    });
  });

  it('renders correct snapshot', () => {
    expect(render(<VerifyEmail />).container).toMatchSnapshot();
  });

  it('calls login if user clicks on verified email button', () => {
    expect(login).not.toHaveBeenCalled();
    const wrapper = render(<VerifyEmail />);
    fireEvent.click(wrapper.getByText("I've verified my email").closest('button'));

    expect(login).toHaveBeenCalled();
  });
});
