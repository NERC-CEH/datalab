const selectCurrentProject = ({ currentProject }) => currentProject;
const selectCurrentProjectKey = ({ currentProject }) => ({
  ...currentProject,
  value: currentProject.value.key,
});

const currentProjectSelectors = {
  currentProject: selectCurrentProject,
  currentProjectKey: selectCurrentProjectKey,
};

export default currentProjectSelectors;
