import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import ProjectInfoContainer, { PureProjectInfoContainer } from './ProjectInfoContainer';
import projectsService from '../../api/projectsService';

jest.mock('../../api/projectsService');
const loadProjectInfoMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
projectsService.loadProjectInfo = loadProjectInfoMock;

describe('ProjectInfoContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
        userPermissions: ['expectedPermission'],
      };

      return shallow(<ProjectInfoContainer {...props} />).find('ProjectInfoContainer');
    }

    const currentProject = { fetching: false, value: { id: 'expectedId' } };

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const store = createStore()({
        currentProject,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('currentProject')).toBe(currentProject);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        currentProject,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toMatchSnapshot();
    });

    it('setCurrentProject function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        currentProject,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').setCurrentProject();
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('SET_CURRENT_PROJECT_ACTION');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureProjectInfoContainer {...props} />);
    }

    const currentProject = { fetching: false, value: { id: 'expectedId' } };

    const generateProps = () => ({
      currentProject,
      userPermissions: ['expectedPermission'],
      actions: {
        setCurrentProject: loadProjectInfoMock,
      },
    });

    beforeEach(() => jest.clearAllMocks());

    it('does not call setCurrentProject action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadProjectInfoMock).toHaveBeenCalledTimes(0);
    });

    it('passes correct props', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });
  });
});
