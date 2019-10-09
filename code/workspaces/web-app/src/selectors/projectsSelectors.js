const selectCurrentProject = ({ currentProject }) => currentProject;
const selectCurrentProjectKey = ({ currentProject }) => ({
  ...currentProject,
  value: currentProject.value.key,
});

const selectProjectArray = ({ projects }) => projects;

export default {
  currentProject: selectCurrentProject,
  currentProjectKey: selectCurrentProjectKey,
  projectArray: selectProjectArray,
};
