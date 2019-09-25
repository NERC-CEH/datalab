import projectsService from '../api/projectsService';

export const LOAD_PROJECTS_ACTION = 'LOAD_PROJECTS';
export const LOAD_PROJECTINFO_ACTION = 'LOAD_PROJECTINFO';
export const CREATE_PROJECT_ACTION = 'CREATE_PROJECT_ACTION';
export const CHECK_PROJECT_KEY_UNIQUE_ACTION = 'CHECK_PROJECT_KEY_UNIQUE_ACTION';

const loadProjects = () => ({
  type: LOAD_PROJECTS_ACTION,
  payload: projectsService.loadProjects(),
});

const loadProjectInfo = projectKey => ({
  type: LOAD_PROJECTINFO_ACTION,
  payload: projectsService.loadProjectInfo(projectKey),
});

const createProject = project => ({
  type: CREATE_PROJECT_ACTION,
  payload: projectsService.createProject(project),
});

const checkProjectKeyUniqueness = projectKey => ({
  type: CHECK_PROJECT_KEY_UNIQUE_ACTION,
  payload: projectsService.checkProjectKeyUniqueness(projectKey),
});

export default {
  loadProjects, loadProjectInfo, createProject, checkProjectKeyUniqueness,
};
