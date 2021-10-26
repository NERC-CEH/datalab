import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import { useUsers } from '../../../hooks/usersHooks';
import UserMultiSelect from './UserMultiSelect';

jest.mock('react-redux');
jest.mock('../../../hooks/usersHooks');

const user1 = { userId: 'user-1', name: 'User 1' };
const user2 = { userId: 'user-2', name: 'User 2' };

describe('UserMultiSelect', () => {
  const shallowRender = () => {
    const props = {
      input: {
        value: [user1, user2],
        onChange: jest.fn().mockName('onChange'),
      },
    };

    return shallow(<UserMultiSelect {...props} />);
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useUsers.mockReturnValue({ fetching: false, value: [user1, user2] });
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
