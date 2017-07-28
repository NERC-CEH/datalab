import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import DataStorageTableContainer, { PureDataStorageTableContainer } from './DataStorageTableContainer';
import dataStorageService from '../../api/dataStorageService';

jest.mock('../../api/dataStorageService');
const loadDataStorageMock = jest.fn().mockReturnValue('expectedPayload');
dataStorageService.loadDataStorage = loadDataStorageMock;

describe('DataStorageTableContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<DataStorageTableContainer {...props} />);
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
      expect(Object.keys(output)).toEqual(expect.arrayContaining(['loadDataStorage', 'loadDataStore', 'openMinioDataStore']));
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
      return shallow(<PureDataStorageTableContainer {...props} />);
    }

    const dataStorage = { fetching: false, value: [{ props: 'expectedPropValue' }] };

    const openMinioDataStoreFn = () => {};
    const generateProps = () => ({
      dataStorage,
      actions: {
        loadDataStorage: loadDataStorageMock,
        loadDataStore: () => {},
        openMinioDataStore: openMinioDataStoreFn,
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

    it('passes correct props to dataStorageTable', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props).find('DataStorageTable');

      // Assert
      expect(output.props()).toEqual({
        dataStorage: dataStorage.value,
        openStorageAction: openMinioDataStoreFn,
      });
    });
  });
});
