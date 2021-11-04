import projectsService from '../api/projectsService';

export const LOAD_PROJECTS_ACTION = 'LOAD_PROJECTS';
export const GET_ALL_PROJECTS_AND_RESOURCES_ACTION = 'GET_ALL_PROJECTS_AND_RESOURCES_ACTION';
export const SET_CURRENT_PROJECT_ACTION = 'SET_CURRENT_PROJECT_ACTION';
export const CLEAR_CURRENT_PROJECT_ACTION = 'CLEAR_CURRENT_PROJECT_ACTION';
export const CREATE_PROJECT_ACTION = 'CREATE_PROJECT_ACTION';
export const REQUEST_PROJECT_ACTION = 'REQUEST_PROJECT_ACTION';
export const UPDATE_PROJECT_ACTION = 'UPDATE_PROJECT_ACTION';
export const DELETE_PROJECT_ACTION = 'DELETE_PROJECT_ACTION';
export const CHECK_PROJECT_KEY_UNIQUE_ACTION = 'CHECK_PROJECT_KEY_UNIQUE_ACTION';

const loadProjects = () => ({
  type: LOAD_PROJECTS_ACTION,
  payload: projectsService.loadProjects(),
});

const getAllProjectsAndResources = () => ({
  type: GET_ALL_PROJECTS_AND_RESOURCES_ACTION,
  payload: projectsService.getAllProjectsAndResources(),
});

const setCurrentProject = projectKey => ({
  type: SET_CURRENT_PROJECT_ACTION,
  payload: projectsService.loadProjectInfo(projectKey),
});

const clearCurrentProject = () => ({
  type: CLEAR_CURRENT_PROJECT_ACTION,
});

const createProject = project => ({
  type: CREATE_PROJECT_ACTION,
  payload: projectsService.createProject(project),
});

const requestProject = project => ({
  type: REQUEST_PROJECT_ACTION,
  payload: projectsService.requestProject(project),
});

const deleteProject = projectKey => ({
  type: DELETE_PROJECT_ACTION,
  payload: projectsService.deleteProject(projectKey),
});

const checkProjectKeyUniqueness = projectKey => ({
  type: CHECK_PROJECT_KEY_UNIQUE_ACTION,
  payload: projectsService.checkProjectKeyUniqueness(projectKey),
});

const updateProject = project => ({
  type: UPDATE_PROJECT_ACTION,
  payload: projectsService.updateProject(project),
});

const projectActions = {
  loadProjects, getAllProjectsAndResources, setCurrentProject, clearCurrentProject, createProject, requestProject, deleteProject, checkProjectKeyUniqueness, updateProject,
};

export default projectActions;
