import rolesSelectors from './rolesSelectors';

const state = {
  roles: ['roles-one', 'roles-two'],
};

describe('roles', () => {
  it('returns value of roles from state', () => {
    const roles = rolesSelectors.roles(state);
    expect(roles).toEqual(state.roles);
    expect(roles).not.toBeUndefined();
  });
});
