import otherUserRolesSelectors from './otherUserRolesSelectors';

const state = {
  otherUserRoles: [{ name: 'name' }],
};

describe('otherUserRoles', () => {
  it('returns value of otherUserRoles from state', () => {
    const otherUserRoles = otherUserRolesSelectors.otherUserRoles(state);
    expect(otherUserRoles).toEqual(state.otherUserRoles);
    expect(otherUserRoles).not.toBeUndefined();
  });
});
