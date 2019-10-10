import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import { PureProjectsContainer, ConnectedProjectsContainer, projectToStack, stackMatchesFilter } from './ProjectsContainer';
import projectsService from '../../api/projectsService';

jest.mock('../../api/projectsService');
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
});
