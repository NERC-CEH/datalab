import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import notify from '../../components/common/notify';
import { PureProjectsContainer, ConnectedProjectsContainer, projectToStack, stackMatchesFilter } from './ProjectsContainer';
import projectsService from '../../api/projectsService';

jest.mock('../../api/projectsService');
jest.mock('../../components/common/notify');

const projectsPayload = {
  value: [{
    id: 123,
    key: 'project2',
    name: 'A project name',
    description: 'A project description',
    accessible: true,
  }],
};
const loadProjectsMock = jest.fn().mockReturnValue(Promise.resolve(projectsPayload));
projectsService.loadProjects = loadProjectsMock;

describe('ProjectsContainer', () => {
  describe('is a component which', () => {
    it('can filter projects', () => {
      const stacks = projectsPayload.value.map(projectToStack);
      expect(stacks.length).toBe(1);
      const stack = stacks[0];
      expect(stackMatchesFilter(stack, '')).toBe(true);
      expect(stackMatchesFilter(stack, 'A project name')).toBe(true);
      expect(stackMatchesFilter(stack, 'A project description')).toBe(true);
      expect(stackMatchesFilter(stack, 'project2')).toBe(false);
    });
  });

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => { },
        PublicComponent: () => { },
        userPermissions: ['expectedPermission'],
      };

      return shallow(<ConnectedProjectsContainer {...props} />).find('ProjectsContainer');
    }

    const projects = { fetching: false, value: ['expectedArray'] };

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const store = createStore()({
        projects,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('projects')).toBe(projects);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        projects,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toMatchSnapshot();
    });

    it('loadProjects function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        projects,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadProjects();
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('LOAD_PROJECTS');
      return payload.then(value => expect(value).toBe(projectsPayload));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureProjectsContainer {...props} />);
    }

    const projects = { fetching: false, value: projectsPayload.value };

    const generateProps = () => ({
      projects,
      userPermissions: ['expectedPermission'],
      actions: {
        loadProjects: loadProjectsMock,
      },
      classes: { controlContainer: 'controlContainer', searchTextField: 'searchTextField' },
    });

    beforeEach(() => jest.clearAllMocks());

    it('calls loadProjects action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadProjectsMock).toHaveBeenCalledTimes(1);
    });

    it('passes correct props to StackCard', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });
  });

  describe('has methods', () => {
    const openModalDialogMock = jest.fn().mockName('openModalDialog');
    const closeModalDialogMock = jest.fn().mockName('closeModalDialog');
    const createProjectMock = jest.fn().mockName('createProject');
    const deleteProjectMock = jest.fn().mockName('deleteProject');
    const resetFormMock = jest.fn().mockName('resetForm');

    const props = {
      projects: { fetching: false, value: projectsPayload.value },
      userPermissions: ['expectedPermission'],
      actions: {
        loadProjects: loadProjectsMock,
        openModalDialog: openModalDialogMock,
        closeModalDialog: closeModalDialogMock,
        createProject: createProjectMock,
        deleteProject: deleteProjectMock,
        resetForm: resetFormMock,
      },
      classes: { controlContainer: 'controlContainer', searchTextField: 'searchTextField' },
    };

    const projectInfo = { key: 'testproj', displayName: 'Test Project' };

    const containerInstance = shallow(<PureProjectsContainer {...props} />).instance();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('confirmDeleteProject', () => {
      it('opens deletion dialog with the correct call', () => {
        containerInstance.confirmDeleteProject(projectInfo);
        expect(openModalDialogMock).toHaveBeenCalledTimes(1);
        expect(openModalDialogMock.mock.calls[0]).toMatchSnapshot();
      });
    });

    describe('onCreateProjectSubmit', () => {
      it('calls action to create project with project info', async () => {
        await containerInstance.onCreateProjectSubmit(projectInfo);
        expect(createProjectMock).toHaveBeenCalledTimes(1);
        expect(createProjectMock).toHaveBeenCalledWith(projectInfo);
      });

      describe('on successful creation', () => {
        it('calls to clear the form using form name', async () => {
          await containerInstance.onCreateProjectSubmit(projectInfo);
          expect(resetFormMock).toHaveBeenCalledTimes(1);
          expect(resetFormMock).toHaveBeenCalledWith('createProject');
        });

        it('notifies the success', async () => {
          await containerInstance.onCreateProjectSubmit(projectInfo);
          expect(notify.success).toHaveBeenCalledTimes(1);
        });
      });

      describe('on failed creation', () => {
        it('notifies of failure', async () => {
          createProjectMock.mockImplementationOnce(() => { throw new Error(); });
          await containerInstance.onCreateProjectSubmit(projectInfo);
          expect(notify.error).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('deleteProject', () => {
      it('calls action to delete project with project key', async () => {
        await containerInstance.deleteProject(projectInfo);
        expect(deleteProjectMock).toHaveBeenCalledTimes(1);
        expect(deleteProjectMock).toHaveBeenCalledWith(projectInfo.key);
      });

      it('calls action to load projects', async () => {
        await containerInstance.deleteProject(projectInfo);
        expect(loadProjectsMock).toHaveBeenCalledTimes(1);
      });

      describe('on successful deletion', () => {
        it('calls to close the modal dialog', async () => {
          await containerInstance.deleteProject(projectInfo);
          expect(closeModalDialogMock).toHaveBeenCalledTimes(1);
        });

        it('it notifies success', async () => {
          await containerInstance.deleteProject(projectInfo);
          expect(notify.success).toHaveBeenCalledTimes(1);
        });
      });

      describe('on failed deletion', () => {
        it('notifies of failure', async () => {
          deleteProjectMock.mockImplementationOnce(() => { throw new Error(); });
          await containerInstance.deleteProject(projectInfo);
          expect(notify.error).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
