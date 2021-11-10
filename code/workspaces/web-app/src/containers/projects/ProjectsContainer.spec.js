import React from 'react';
import { Provider } from 'react-redux';
import createStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { reset } from 'redux-form';
import notify from '../../components/common/notify';
import { getFeatureFlags } from '../../config/featureFlags';

import ProjectsContainer, { confirmDeleteProject, deleteProject, onCreateProjectSubmit, projectToStack, stackMatchesFilter } from './ProjectsContainer';
import projectsService from '../../api/projectsService';
import projectActions from '../../actions/projectActions';
import modalDialogActions from '../../actions/modalDialogActions';

jest.mock('redux-form');

jest.mock('../../api/projectsService');
jest.mock('../../components/common/notify');
jest.mock('../../components/stacks/StackCards', () => props => <div>StackCards Mock - props = {JSON.stringify(props, null, 2)}</div>);
jest.mock('../../config/featureFlags');
jest.mock('@material-ui/core/Switch', () => props => (<div>{`Switch mock - checked: ${props.checked}`}</div>));
jest.mock('@material-ui/core/FormControlLabel', () => props => (<div>{`Form control label mock - label: ${props.label}`}{props.control}</div>));

const projectsPayload = {
  value: [{
    id: 123,
    key: 'project2',
    name: 'A project name',
    description: 'A project description',
    accessible: true,
  }],
};

function renderWithStore({
  projects = projectsPayload,
  userPermissionsArray = ['expected-user-permission', 'system:instance:admin'],
} = {}) {
  const middlewares = [];
  const initialState = {
    authentication: { permissions: { value: userPermissionsArray } },
    projects,
  };
  const store = createStore(middlewares)(initialState);
  const wrapper = mount(
    <Provider store={store}>
      <ProjectsContainer/>
    </Provider>,
  );

  return { store, wrapper };
}

let loadProjectsMock;
beforeEach(() => {
  loadProjectsMock = jest.fn().mockResolvedValue(projectsPayload);
  projectsService.loadProjects = loadProjectsMock;

  getFeatureFlags.mockReturnValue({ requestProjects: true });
});

describe('ProjectsContainer', () => {
  describe('is a component which', () => {
    it('can filter projects by name, key and description', () => {
      const stacks = projectsPayload.value.map(projectToStack);
      expect(stacks.length).toBe(1);
      const stack = stacks[0];
      expect(stackMatchesFilter(stack, '')).toBe(true);
      expect(stackMatchesFilter(stack, 'A project name')).toBe(true);
      expect(stackMatchesFilter(stack, 'A project description')).toBe(true);
      expect(stackMatchesFilter(stack, 'project2')).toBe(true);
      expect(stackMatchesFilter(stack, 'missing search')).toBe(false);
    });
  });

  it('renders to match snapshot', () => {
    const { wrapper } = renderWithStore();
    expect(wrapper.find(ProjectsContainer)).toMatchSnapshot();
  });

  it('renders request button if not admin', () => {
    const { wrapper } = renderWithStore({ userPermissionsArray: ['expected-user-permission'] });
    expect(wrapper.find(ProjectsContainer)).toMatchSnapshot();
  });

  it('passes admin permission if requestProjects feature flag is off', () => {
    getFeatureFlags.mockReturnValue({ requestProjects: false });
    const { wrapper } = renderWithStore({ userPermissionsArray: ['expected-user-permission'] });
    expect(wrapper.find(ProjectsContainer)).toMatchSnapshot();
  });

  it('loads projects when it is rendered', () => {
    const { store } = renderWithStore();
    const actions = store.getActions();
    expect(actions).toEqual([projectActions.loadProjects()]);
  });

  describe('has methods', () => {
    const originalModalDialogActions = { ...modalDialogActions };
    const originalProjectActions = { ...projectActions };

    let openModalDialogMock;
    let closeModalDialogMock;
    let createProjectMock;
    let deleteProjectMock;
    let dispatchMock;

    beforeEach(() => {
      jest.clearAllMocks();

      openModalDialogMock = jest.fn(() => 'openModalDialogMock').mockName('openModalDialog');
      modalDialogActions.openModalDialog = openModalDialogMock;

      closeModalDialogMock = jest.fn(() => 'closeModalDialogMock').mockName('closeModalDialog');
      modalDialogActions.closeModalDialog = closeModalDialogMock;

      createProjectMock = jest.fn(() => 'createProjectMock').mockName('createProject');
      projectActions.createProject = createProjectMock;

      deleteProjectMock = jest.fn(() => 'deleteProjectMock').mockName('deleteProject');
      projectActions.deleteProject = deleteProjectMock;

      dispatchMock = jest.fn().mockName('dispatch');
    });

    afterAll(() => {
      modalDialogActions.openModalDialog = originalModalDialogActions.openModalDialog;
      modalDialogActions.closeModalDialog = originalModalDialogActions.closeModalDialog;
      projectActions.createProject = originalProjectActions.createProject;
      projectActions.deleteProject = originalProjectActions.deleteProject;
      projectActions.loadProjects = loadProjectsMock;
    });

    const projectInfo = { key: 'testproj', displayName: 'Test Project' };

    describe('confirmDeleteProject', () => {
      it('opens deletion dialog with the correct call', () => {
        confirmDeleteProject(dispatchMock)(projectInfo);
        expect(openModalDialogMock).toHaveBeenCalledTimes(1);
        expect(openModalDialogMock.mock.calls[0]).toMatchSnapshot();
        expect(dispatchMock).toHaveBeenLastCalledWith('openModalDialogMock');
      });
    });

    describe('onCreateProjectSubmit', () => {
      it('calls action to create project with project info', async () => {
        await onCreateProjectSubmit(dispatchMock)(projectInfo);
        expect(createProjectMock).toHaveBeenCalledTimes(1);
        expect(createProjectMock).toHaveBeenCalledWith(projectInfo);
        expect(dispatchMock).toHaveBeenCalledWith('createProjectMock');
      });

      it('calls action to request project with project info if not admin', async () => {
        projectActions.requestProject = jest.fn(() => 'requestProjectMock');
        await onCreateProjectSubmit(dispatchMock, true)(projectInfo);
        expect(projectActions.requestProject).toHaveBeenCalledTimes(1);
        expect(projectActions.requestProject).toHaveBeenCalledWith(projectInfo);
        expect(dispatchMock).toHaveBeenCalledWith('requestProjectMock');
      });

      describe('on successful creation', () => {
        it('calls to clear the form using form name', async () => {
          await onCreateProjectSubmit(dispatchMock)(projectInfo);
          expect(reset).toHaveBeenCalledTimes(1);
          expect(reset).toHaveBeenCalledWith('createProject');
        });

        it('notifies the success', async () => {
          await onCreateProjectSubmit(dispatchMock)(projectInfo);
          expect(notify.success).toHaveBeenCalledTimes(1);
        });
      });

      describe('on successful request', () => {
        it('calls to clear the form using form name', async () => {
          await onCreateProjectSubmit(dispatchMock, true)(projectInfo);
          expect(reset).toHaveBeenCalledTimes(1);
          expect(reset).toHaveBeenCalledWith('createProject');
        });

        it('notifies the success', async () => {
          await onCreateProjectSubmit(dispatchMock, true)(projectInfo);
          expect(notify.success).toHaveBeenCalledTimes(1);
          expect(notify.success).toHaveBeenCalledWith('Project requested: a notification has been sent to the instance admins.');
        });
      });

      describe('on failed creation', () => {
        it('notifies of failure', async () => {
          createProjectMock.mockImplementationOnce(() => { throw new Error(); });
          await onCreateProjectSubmit(dispatchMock)(projectInfo);
          expect(notify.error).toHaveBeenCalledTimes(1);
        });
      });

      describe('on failed request', () => {
        it('notifies of failure', async () => {
          projectActions.requestProject = jest.fn(() => { throw new Error(); });
          await onCreateProjectSubmit(dispatchMock, true)(projectInfo);
          expect(notify.error).toHaveBeenCalledTimes(1);
          expect(notify.error).toHaveBeenCalledWith('Unable to request Project');
        });
      });
    });

    describe('deleteProject', () => {
      it('calls action to delete project with project key', async () => {
        await deleteProject(dispatchMock, projectInfo);
        expect(deleteProjectMock).toHaveBeenCalledTimes(1);
        expect(deleteProjectMock).toHaveBeenCalledWith(projectInfo.key);
        expect(dispatchMock).toHaveBeenCalledWith('deleteProjectMock');
      });

      it('calls action to load projects', async () => {
        await deleteProject(dispatchMock, projectInfo);
        expect(loadProjectsMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({ payload: Promise.resolve(projectsPayload), type: 'LOAD_PROJECTS' });
      });

      describe('on successful deletion', () => {
        it('calls to close the modal dialog', async () => {
          await deleteProject(dispatchMock, projectInfo);
          expect(closeModalDialogMock).toHaveBeenCalledTimes(1);
          expect(dispatchMock).toHaveBeenCalledWith('closeModalDialogMock');
        });

        it('it notifies success', async () => {
          await deleteProject(dispatchMock, projectInfo);
          expect(notify.success).toHaveBeenCalledTimes(1);
        });
      });

      describe('on failed deletion', () => {
        it('notifies of failure', async () => {
          deleteProjectMock.mockImplementationOnce(() => { throw new Error(); });
          await deleteProject(dispatchMock, projectInfo);
          expect(notify.error).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
