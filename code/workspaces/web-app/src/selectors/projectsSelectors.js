const selectCurrentProject = ({ currentProject }) => currentProject;
const selectCurrentProjectKey = ({ currentProject }) => ({
  ...currentProject,
  value: currentProject.value.key,
});

const selectProjectArray = ({ projects }) => projects;

const selectProjectUsers = ({ projectUsers }) => projectUsers;

export default {
  currentProject: selectCurrentProject,
  currentProjectKey: selectCurrentProjectKey,
  projectArray: selectProjectArray,
  projectUsers: selectProjectUsers,
};
