import usersSelectors from './usersSelectors';

const state = {
  users: ['user-one', 'user-two'],
};

describe('users', () => {
  it('returns value of users from state', () => {
    const users = usersSelectors.users(state);
    expect(users).toEqual(state.users);
    expect(users).not.toBeUndefined();
  });
});
