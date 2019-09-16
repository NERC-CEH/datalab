import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import { PureProjectsContainer, ConnectedProjectsContainer } from './ProjectsContainer';
import projectsService from '../../api/projectsService';

jest.mock('../../api/projectsService');
const loadProjectsMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
projectsService.loadProjects = loadProjectsMock;

describe('ProjectsContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
        userPermissions: ['expectedPermission'],
      };

      return shallow(<ConnectedProjectsContainer {...props} />).find('ProjectsContainer');
    }

    const projects = { fetching: false, value: { projectArray: ['expectedArray'] } };

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
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureProjectsContainer {...props} />);
    }

    const projects = { fetching: false, value: { projectArray: ['expectedArray'] } };

    const generateProps = () => ({
      projects,
      userPermissions: ['expectedPermission'],
      actions: {
        loadProjects: loadProjectsMock,
      },
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
