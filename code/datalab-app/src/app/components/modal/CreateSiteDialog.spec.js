import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import CreateSiteDialog, { PureCreateSiteDialog } from './CreateSiteDialog';
import dataStorageService from '../../api/dataStorageService';

jest.mock('../../api/dataStorageService');
const loadDataStorageMock = jest.fn().mockReturnValue('expectedPayload');
dataStorageService.loadDataStorage = loadDataStorageMock;

describe('Site dialog', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
        title: 'Title',
        onSubmit: () => {},
        onCancel: () => {},
      };

      return shallow(<CreateSiteDialog {...props} />);
    }

    const dataStorage = { fetching: false, value: ['expectedArray'] };

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('dataStorage')).toBe(dataStorage);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toContain('loadDataStorage');
    });

    it('loadDataStorage function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadDataStorage();
      expect(store.getActions()[0]).toEqual({
        type: 'LOAD_DATASTORAGE',
        payload: 'expectedPayload',
      });
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureCreateSiteDialog {...props} />);
    }

    const onSubmitMock = jest.fn();
    const onCancelMock = jest.fn();

    const generateProps = () => ({
      title: 'Title',
      onSubmit: onSubmitMock,
      onCancel: onCancelMock,
      actions: {
        loadDataStorage: loadDataStorageMock,
      },
      dataStorage: {
        value: [
          { displayName: 'First Data Store', value: 'alhpa' },
          { displayName: 'Second Data Store', value: 'beta' },
        ],
      },
    });

    beforeEach(() => jest.resetAllMocks());

    it('calls loadDataStorage action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadDataStorageMock).toHaveBeenCalledTimes(1);
    });

    it('creates correct snapshot', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props);

      // Assert
      expect(output).toMatchSnapshot();
    });

    it('wires up cancel function correctly', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props);
      const cancelFunction = output.find('ReduxForm').prop('cancel');
      cancelFunction();

      // Assert
      expect(onCancelMock).toHaveBeenCalled();
    });

    it('wires up submit function correctly', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props);
      const submitFunction = output.find('ReduxForm').prop('onSubmit');
      submitFunction();

      // Assert
      expect(onSubmitMock).toHaveBeenCalled();
    });
  });
});
