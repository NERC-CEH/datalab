import projectsService from '../api/projectsService';

export const LOAD_PROJECTS_ACTION = 'LOAD_PROJECTS';
export const SET_CURRENT_PROJECT_ACTION = 'SET_CURRENT_PROJECT_ACTION';
export const CREATE_PROJECT_ACTION = 'CREATE_PROJECT_ACTION';
export const DELETE_PROJECT_ACTION = 'DELETE_PROJECT_ACTION';
export const CHECK_PROJECT_KEY_UNIQUE_ACTION = 'CHECK_PROJECT_KEY_UNIQUE_ACTION';

const loadProjects = () => ({
  type: LOAD_PROJECTS_ACTION,
  payload: projectsService.loadProjects(),
});

const setCurrentProject = projectKey => ({
  type: SET_CURRENT_PROJECT_ACTION,
  payload: projectsService.loadProjectInfo(projectKey),
});

const createProject = project => ({
  type: CREATE_PROJECT_ACTION,
  payload: projectsService.createProject(project),
});

const deleteProject = projectKey => ({
  type: DELETE_PROJECT_ACTION,
  payload: projectsService.deleteProject({ projectKey }),
});

const checkProjectKeyUniqueness = projectKey => ({
  type: CHECK_PROJECT_KEY_UNIQUE_ACTION,
  payload: projectsService.checkProjectKeyUniqueness(projectKey),
});

export default {
  loadProjects, setCurrentProject, createProject, deleteProject, checkProjectKeyUniqueness,
};
