import React from 'react';
import { render, screen, fireEvent } from '../../testUtils/renderTests';
import UserIcon from './UserIcon';
import { getAuth } from '../../config/auth';

jest.mock('../../config/auth');

const logout = jest.fn();

const expectedProps = {
  identity: {
    picture: 'expectedPicture',
    nickname: 'test nickname',
    name: 'test name',
  },
};

beforeEach(() => {
  getAuth.mockImplementation(() => ({
    logout,
  }));
});

describe('UserIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot', () => {
    const wrapper = render(<UserIcon {...expectedProps} />);
    fireEvent.click(wrapper.getByRole('img'));
    expect(screen.getByRole('img').parentElement.parentElement.parentElement).toMatchSnapshot();
  });

  it('onClick function changes popover open prop', () => {
    const wrapper = render(<UserIcon {...expectedProps} />);
    fireEvent.click(wrapper.getByRole('img'));

    expect(screen.getByText('test name')).not.toBeNull();
  });

  it('closeOnClick function changes popover open prop', () => {
    const wrapper = render(<UserIcon {...expectedProps} />);
    fireEvent.click(wrapper.getByRole('img'));

    // need to query by role here as queryByText will still find the "aria-hidden" items
    expect(screen.queryByRole('button')).not.toBeNull();
    fireEvent.click(wrapper.getByText('Logout'));
    expect(screen.queryByRole('button')).toBeNull();
  });
});
