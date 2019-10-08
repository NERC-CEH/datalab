import projectsSelectors from './projectsSelectors';

const testProj = { key: 'testproj', name: 'Test Project' };

const state = {
  projects: {
    fetching: false,
    error: null,
    value: [testProj],
  },
  currentProject: {
    error: null,
    fetching: false,
    value: testProj,
  },
};

describe('currentProject', () => {
  it('returns value of currentProject from state', () => {
    const currentProject = projectsSelectors.currentProject(state);
    expect(currentProject).toEqual(state.currentProject);
    expect(currentProject).not.toBeUndefined();
  });
});

describe('currentProjectKey', () => {
  it('returns value as project key from state when it is defined', () => {
    expect(projectsSelectors.currentProjectKey(state).value).toEqual('testproj');
  });

  it('returns value as undefined when project key not defined', () => {
    const missingState = { ...state };
    missingState.currentProject.value = {};
    expect(projectsSelectors.currentProjectKey(missingState).value).toBeUndefined();
  });
});

describe('projectArray', () => {
  it('returns value of projects from state', () => {
    const projectArray = projectsSelectors.projectArray(state);
    expect(projectArray).toEqual(state.projects);
    expect(projectArray).not.toBeUndefined();
  });
});
