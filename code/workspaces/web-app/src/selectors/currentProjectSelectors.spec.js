import currentProjectSelectors from './currentProjectSelectors';

const state = {
  currentProject: {
    fetching: false,
    error: null,
    value: { key: 'testproj', name: 'Test Project' },
  },
};

describe('currentProject', () => {
  it('returns value of currentProject from state', () => {
    const currentProject = currentProjectSelectors.currentProject(state);
    expect(currentProject).toEqual(state.currentProject);
    expect(currentProject).not.toBeUndefined();
  });
});

describe('currentProjectKey', () => {
  it('returns value as project key from state when it is defined', () => {
    expect(currentProjectSelectors.currentProjectKey(state).value).toEqual('testproj');
  });

  it('returns value as undefined when project key not defined', () => {
    const missingState = { ...state };
    missingState.currentProject.value = {};
    expect(currentProjectSelectors.currentProjectKey(missingState).value).toBeUndefined();
  });
});
