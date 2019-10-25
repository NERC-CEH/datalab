import projectsSelectors from './projectsSelectors';

const testProj = { key: 'testproj', name: 'Test Project' };

const state = {
  projects: {
    fetching: false,
    error: null,
    value: [testProj],
  },
};

describe('projectArray', () => {
  it('returns value of projects from state', () => {
    const projectArray = projectsSelectors.projectArray(state);
    expect(projectArray).toEqual(state.projects);
    expect(projectArray).not.toBeUndefined();
  });
});
