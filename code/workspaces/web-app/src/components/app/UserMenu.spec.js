import React from 'react';
import { render } from '@testing-library/react';
import UserMenu from './UserMenu';
import { getAuth } from '../../config/auth';

jest.mock('@material-ui/core/Avatar', () => props => (<div>Avatar mock {JSON.stringify(props)}</div>));
jest.mock('../../config/auth');
const logout = jest.fn();
const closePopoverMock = jest.fn();

const expectedProps = {
  identity: {
    name: 'expectedName',
    nickname: 'expectedNickname',
    picture: 'expectedPicture',
  },
  closePopover: closePopoverMock,
};

beforeEach(() => {
  getAuth.mockImplementation(() => ({
    logout,
  }));
});

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot', () => {
    expect(render(<UserMenu {...expectedProps} />).container).toMatchSnapshot();
  });

  it('wraps auth.logout with closePopover wrapper', () => {
    expect(closePopoverMock).not.toHaveBeenCalled();

    render(<UserMenu {...expectedProps} />);

    expect(closePopoverMock).toHaveBeenCalledWith(logout);
  });
});
