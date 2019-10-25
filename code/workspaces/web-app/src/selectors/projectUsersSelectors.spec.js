import projectUsersSelectors from './projectUsersSelectors';

const state = {
  projectUsers: {
    error: null,
    fetching: false,
    value: [{ name: 'user', userId: 'user-id' }],
  },
};

describe('projectUsers', () => {
  it('returns value of projectUsers from state', () => {
    const projectArray = projectUsersSelectors.projectUsers(state);
    expect(projectArray).toEqual(state.projectUsers);
    expect(projectArray).not.toBeUndefined();
  });
});
