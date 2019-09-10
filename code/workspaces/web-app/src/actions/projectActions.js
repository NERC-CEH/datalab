import projectsService from '../api/projectsService';

export const LOAD_PROJECTS_ACTION = 'LOAD_PROJECTS';

const loadProjects = () => ({
  type: LOAD_PROJECTS_ACTION,
  payload: projectsService.loadProjects(),
});

export default {
  loadProjects,
};
