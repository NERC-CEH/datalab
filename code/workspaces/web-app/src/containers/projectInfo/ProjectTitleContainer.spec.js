import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import ProjectTitleContainer, { PureProjectTitleContainer } from './ProjectTitleContainer';
import projectsService from '../../api/projectsService';

jest.mock('../../api/projectsService');
const loadProjectInfoMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
projectsService.loadProjectInfo = loadProjectInfoMock;

describe('ProjectTitleContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        projectKey: 'project99',
        PrivateComponent: () => {},
        PublicComponent: () => {},
        userPermissions: ['expectedPermission'],
      };

      return shallow(<ProjectTitleContainer {...props} />).find('ProjectTitleContainer');
    }

    const projects = { fetching: false, value: { currentProject: { id: 'expectedId' } } };

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

    it('loadProjectInfo function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        projects,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadProjectInfo();
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('LOAD_PROJECTINFO');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureProjectTitleContainer {...props} />);
    }

    const projects = { fetching: false, value: { currentProject: { id: 'expectedId' } } };

    const generateProps = () => ({
      projects,
      projectKey: 'project99',
      userPermissions: ['expectedPermission'],
      actions: {
        loadProjectInfo: loadProjectInfoMock,
      },
    });

    beforeEach(() => jest.clearAllMocks());

    it('calls loadProjectInfo action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadProjectInfoMock).toHaveBeenCalledTimes(1);
    });

    it('passes correct props', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });
  });
});
