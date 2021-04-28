import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import DataStorageContainer, { PureDataStorageContainer } from './DataStorageContainer';
import dataStorageService from '../../api/dataStorageService';

jest.mock('../../api/dataStorageService');
const loadDataStorageServiceMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
dataStorageService.loadDataStorage = loadDataStorageServiceMock;

describe('DataStorageContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
        userPermissions: ['expectedPermission'],
        projectKey: 'project99',
        showCreateButton: true,
      };

      return shallow(<DataStorageContainer {...props} />).find('DataStorageContainer');
    }

    const dataStorage = { fetching: false, value: ['expectedArray'] };
    const currentProject = { fetching: false, value: 'project-key' };

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        currentProject,
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
        currentProject,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toMatchSnapshot();
    });

    it('loadDataStorage function dispatch correct action', () => {
      // Arrange
      const store = createStore()({
        dataStorage,
        currentProject,
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
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureDataStorageContainer {...props} />);
    }

    const dataStorage = { fetching: false, value: [{ props: 'expectedPropValue', projectKey: 'project99' }] };
    const loadDataStorageActionMock = jest.fn().mockResolvedValue({ payload: { projectKey: 'project99', storage: 'expectedPayload' } });
    const getCredentialsMock = jest.fn();
    const openMinioDataStoreMock = jest.fn();
    const openModalDialogMock = jest.fn();
    const closeModalDialogMock = jest.fn();
    const deleteDataStoreMock = jest.fn();
    const createDataStoreMock = jest.fn();
    const resetFormMock = jest.fn();

    const generateProps = () => ({
      dataStorage,
      userPermissions: ['expectedPermission'],
      projectKey: 'project99',
      modifyData: true,
      actions: {
        loadDataStorage: loadDataStorageActionMock,
        getCredentials: getCredentialsMock,
        createDataStore: createDataStoreMock,
        deleteDataStore: deleteDataStoreMock,
        openMinioDataStore: openMinioDataStoreMock,
        openModalDialog: openModalDialogMock,
        closeModalDialog: closeModalDialogMock,
        resetForm: resetFormMock,
      },
    });

    beforeEach(() => jest.clearAllMocks());

    it('calls loadDataStorage action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadDataStorageActionMock).toHaveBeenCalledTimes(1);
    });

    it('passes correct props to StackCard', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });

    it('openNotebook method calls openNotebook action on resolved getUrl', () => {
      // Arrange
      getCredentialsMock.mockReturnValue(Promise.resolve({ value: { url: 'expectedUrl', accessKey: 'expectedKey' } }));
      const props = generateProps();
      const output = shallowRenderPure(props);
      const openStack = output.prop('openStack');

      // Act/Assert
      expect(getCredentialsMock).not.toHaveBeenCalled();
      expect(openMinioDataStoreMock).not.toHaveBeenCalled();
      return openStack({ id: 1000 })
        .then(() => {
          expect(getCredentialsMock).toHaveBeenCalledTimes(1);
          expect(getCredentialsMock).toHaveBeenCalledWith('project99', 1000);
          expect(openMinioDataStoreMock).toHaveBeenCalledTimes(1);
          expect(openMinioDataStoreMock).toHaveBeenCalledWith('expectedUrl', 'expectedKey');
        });
    });

    it('confirmDeleteDataStore calls openModalDialog with correct action for unmounted volume', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName', stacksMountingStore: [] };

      // Act/Assert
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      deleteStack(stack);
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('MODAL_TYPE_ROBUST_CONFIRMATION');
    });

    it('confirmDeleteDataStore calls openModalDialog with correct action for a mounted volume', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName', stacksMountingStore: [1, 2, 3] };

      // Act/Assert
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      deleteStack(stack);
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('MODAL_TYPE_CONFIRMATION');
    });

    it('confirmDeleteDataStore generates correct dialog for unmounted volume', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName', stacksMountingStore: [] };

      // Act
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      deleteStack(stack);

      // Assert
      const firstMockCall = openModalDialogMock.mock.calls[0];
      const { title, body, onCancel } = firstMockCall[1];
      expect({ title, body }).toMatchSnapshot();
      expect(onCancel).toBe(closeModalDialogMock);
    });

    it('confirmDeleteDataStore generates correct dialog for mounted volume', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName', stacksMountingStore: [1, 2, 3] };

      // Act
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      deleteStack(stack);

      // Assert
      const firstMockCall = openModalDialogMock.mock.calls[0];
      const { title, body, onCancel } = firstMockCall[1];
      expect({ title, body }).toMatchSnapshot();
      expect(onCancel).toBe(closeModalDialogMock);
    });

    it('confirmDeleteDataStore - onSubmit calls deleteDataStore with correct value', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName', stacksMountingStore: [] };

      // Act
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      deleteStack(stack);
      const { onSubmit } = openModalDialogMock.mock.calls[0][1];

      // Assert
      expect(deleteDataStoreMock).not.toHaveBeenCalled();
      return onSubmit()
        .then(() => {
          expect(deleteDataStoreMock).toHaveBeenCalledTimes(1);
          expect(deleteDataStoreMock).toHaveBeenCalledWith('project99', stack);
        });
    });

    it('openCreationForm calls openModalDialog with correct action', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName' };

      // Act/Assert
      const output = shallowRenderPure(props);
      const openCreationForm = output.prop('openCreationForm');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      openCreationForm(stack);
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('MODAL_TYPE_CREATE_STORE');
    });

    it('openCreationForm generates correct dialog', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName' };

      // Act
      const output = shallowRenderPure(props);
      const openCreationForm = output.prop('openCreationForm');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      openCreationForm(stack);

      // Assert
      const firstMockCall = openModalDialogMock.mock.calls[0];
      const { title, onCancel } = firstMockCall[1];
      expect({ title }).toMatchSnapshot();
      expect(onCancel).toBe(closeModalDialogMock);
    });

    it('openCreationForm - onSubmit calls createStack with correct value', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName', name: 'expectedName' };

      // Act
      const output = shallowRenderPure(props);
      const openCreationForm = output.prop('openCreationForm');
      openCreationForm();
      const { onSubmit } = openModalDialogMock.mock.calls[0][1];

      // Assert
      expect(createDataStoreMock).not.toHaveBeenCalled();
      expect(resetFormMock).not.toHaveBeenCalled();
      expect(loadDataStorageActionMock).toHaveBeenCalledTimes(1);
      return onSubmit(stack)
        .then(() => {
          expect(createDataStoreMock).toHaveBeenCalledTimes(1);
          expect(createDataStoreMock).toHaveBeenCalledWith('project99', stack);
          expect(resetFormMock).toHaveBeenCalledTimes(1);
        });
    });

    it('openEditForm generates correct dialog', () => {
      // Arrange
      const props = generateProps();
      const inputStack = { displayName: 'expectedDisplayName', id: 'expectedId' };

      // Act
      const output = shallowRenderPure(props);
      const editStack = output.prop('editStack');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      editStack(inputStack);

      // Assert
      const firstMockCall = openModalDialogMock.mock.calls[0];
      const { title, onCancel, dataStoreId, userKeysMapping, stack, typeName } = firstMockCall[1];
      expect({ title, dataStoreId, userKeysMapping, stack, typeName }).toMatchSnapshot();
      expect(onCancel).toBe(closeModalDialogMock);
    });
  });
});
