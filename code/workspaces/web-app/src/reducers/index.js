import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import projects from './projectsReducer';
import stacks from './stacksReducer';
import modal from './modelDialogReducer';
import users from './usersReducer';
import projectUsers from './projectSettingsReducers';
import currentProject from './currentProjectReducer';

const rootReducer = history => combineReducers({
  authentication,
  dataStorage,
  projects,
  stacks,
  modal,
  users,
  projectUsers,
  currentProject,
  router: connectRouter(history),
  form: formReducer,
});

export default rootReducer;
