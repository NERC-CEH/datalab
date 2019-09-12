import projectsService from '../api/projectsService';

export const LOAD_PROJECTS_ACTION = 'LOAD_PROJECTS';
export const LOAD_PROJECTINFO_ACTION = 'LOAD_PROJECTINFO';

const loadProjects = () => ({
  type: LOAD_PROJECTS_ACTION,
  payload: projectsService.loadProjects(),
});

const loadProjectInfo = projectKey => ({
  type: LOAD_PROJECTINFO_ACTION,
  payload: projectsService.loadProjectInfo(projectKey),
});

export default {
  loadProjects, loadProjectInfo,
};
