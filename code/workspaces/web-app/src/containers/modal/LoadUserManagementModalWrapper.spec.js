import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import LoadUserManagementModalWrapper, { PureLoadUserManagementModalWrapper } from './LoadUserManagementModalWrapper';
import dataStorageService from '../../api/dataStorageService';
import listUsersService from '../../api/listUsersService';

jest.mock('../../api/dataStorageService');
const loadDataStorageMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
dataStorageService.loadDataStorage = loadDataStorageMock;
const addUserToDataStoreMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
dataStorageService.addUserToDataStore = addUserToDataStoreMock;
const removeUserFromDataStoreMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
dataStorageService.removeUserFromDataStore = removeUserFromDataStoreMock;

jest.mock('../../api/listUsersService');
const listUsersMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
listUsersService.listUsers = listUsersMock;

describe('LoadUserManagement Modal Wrapper', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
        title: 'Title',
        onCancel: () => {},
        Dialog: () => {},
        dataStoreId: 'dataStoreId',
        projectKey: 'project99',
        userKeysMapping: {},
      };

      return shallow(<LoadUserManagementModalWrapper {...props} />).find('LoadUserManagementModalWrapper');
    }

    const dataStorage = { fetching: false, value: ['expectedArray'] };
    const users = { fetching: false, value: ['expectedArray'] };
    const authentication = { identity: { sub: 'expectedSub' } };

    it('extracts the correct props from redux state', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('dataStorage')).toBe(dataStorage);
      expect(output.prop('users')).toBe(users);
      expect(output.prop('loginUserId')).toBe('expectedSub');
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toContain(
        'loadDataStorage',
        'addUserToDataStore',
        'removeUserFromDataStore',
        'listUsers',
      );
    });

    it('loadDataStorage function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadDataStorage('project99');
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('LOAD_DATASTORAGE');
      return payload.then(value => expect(value).toEqual({ projectKey: 'project99', storage: 'expectedPayload' }));
    });

    it('addUserToDataStore function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').addUserToDataStore('project99', { name: 'name', users: ['user'] });
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('ADD_USER_TO_DATASTORE');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });

    it('removeUserFromDataStore function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').removeUserFromDataStore('project99', { name: 'name', users: ['user'] });
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('REMOVE_USER_FROM_DATASTORE');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });

    it('listUsers function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
        authentication,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').listUsers();
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('LIST_USERS');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureLoadUserManagementModalWrapper {...props} />);
    }

    const onCancelMock = jest.fn();

    const generateProps = () => ({
      title: 'Title',
      onCancel: onCancelMock,
      dataStoreId: 'expectedDataId',
      userKeysMapping: {
        userId: 'value',
        name: 'label',
      },
      projectKey: 'project99',
      actions: {
        loadDataStorage: loadDataStorageMock,
        addUserToDataStore: addUserToDataStoreMock,
        removeUserFromDataStore: removeUserFromDataStoreMock,
        listUsers: listUsersMock,
      },
      dataStorage: {
        value: [
          { id: 'expectedDataId', users: [{ userId: 'expectedId', name: 'expectedName' }] },
        ],
      },
      authentication: {
        identity: {
          sub: 'expectedId',
        },
      },
      users: {
        value: [
          { userId: 'expectedId', name: 'expectedName' },
          { userId: 'anotherExpectedId', name: 'anotherExpectedName' },
        ],
      },
      stack: { displayName: 'displayName', description: 'description' },
      typeName: 'Data Store',
      Dialog: () => {},
    });

    it('calls loadDataStorage action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(listUsersMock).toHaveBeenCalledTimes(1);
    });

    it('creates correct snapshot', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props);

      // Assert
      expect(output).toMatchSnapshot();
    });
  });
});
