import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import UserMenu from './UserMenu';
import UserIcon from './UserIcon';

const expectedProps = {
  identity: {
    picture: 'expectedPicture',
  },
};

describe('UserIcon', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  function shallowRender(props) {
    return shallow(<UserIcon {...props} />);
  }

  it('renders correct snapshot', () => {
    expect(shallowRender(expectedProps)).toMatchSnapshot();
  });

  it('onClick function changes popover open prop', () => {
    const output = shallowRender(expectedProps);
    const onClickFunction = output.find(Avatar).prop('onClick');

    // Due to changes to state, the same node need to be used for the expect checks.
    expect(output.find(Popover).prop('open')).toBe(false);
    onClickFunction();
    expect(output.find(Popover).prop('open')).toBe(true);
  });

  it('closeOnClick function changes popover open prop', () => {
    const output = shallowRender(expectedProps);
    const onClickFunction = output.find(Avatar).prop('onClick');
    const nextMock = jest.fn();
    const closeFunct = output.find(UserMenu).prop('closePopover')(nextMock);

    // Due to changes to state, the same node need to be used for the expect checks.
    onClickFunction(); // should open popover
    expect(output.find(Popover).prop('open')).toBe(true);
    expect(nextMock).not.toHaveBeenCalled();
    closeFunct(); // should close popover
    expect(output.find(Popover).prop('open')).toBe(false);
    expect(nextMock).toHaveBeenCalledTimes(1);
  });
});
