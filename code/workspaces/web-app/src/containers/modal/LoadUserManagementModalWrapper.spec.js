import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import LoadUserManagementModalWrapper, { PureLoadUserManagementModalWrapper } from './LoadUserManagementModalWrapper';
import listUsersService from '../../api/listUsersService';

jest.mock('../../api/listUsersService');

let listUsersMock;

beforeEach(() => {
  listUsersMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
  listUsersService.listUsers = listUsersMock;
});

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

    it('extracts the correct props from redux state', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('dataStorage')).toBe(dataStorage);
      expect(output.prop('users')).toBe(users);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toContain(
        'listUsers',
      );
    });

    it('listUsers function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        users,
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
        listUsers: listUsersMock,
      },
      dataStorage: {
        value: [
          { id: 'expectedDataId', users: [{ userId: 'expectedId', name: 'expectedName' }] },
        ],
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
