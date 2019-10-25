const selectCurrentProject = ({ currentProject }) => currentProject;
const selectCurrentProjectKey = ({ currentProject }) => ({
  ...currentProject,
  value: currentProject.value.key,
});

export default {
  currentProject: selectCurrentProject,
  currentProjectKey: selectCurrentProjectKey,
};
