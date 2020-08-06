import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import StacksContainer, { PureStacksContainer } from './StacksContainer';
import stackService from '../../api/stackService';
import listUsersService from '../../api/listUsersService';
import notify from '../../components/common/notify';

jest.mock('../../api/stackService');
const loadStacksMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
stackService.loadStacksByCategory = loadStacksMock;
const listUsersMock = jest.fn();
listUsersService.listUsers = listUsersMock;

jest.mock('../../components/common/notify');
const toastrErrorMock = jest.fn();
const toastrSuccessMock = jest.fn();
notify.error = toastrErrorMock;
notify.success = toastrSuccessMock;

jest.useFakeTimers();

describe('StacksContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        typeName: 'Notebook',
        containerType: 'analysis',
        dialogAction: 'ACTION',
        formStateName: 'createNotebook',
        PrivateComponent: () => {},
        PublicComponent: () => {},
        userPermissions: ['expectedPermission'],
        projectKey: 'testproj',
      };

      return shallow(<StacksContainer {...props} />).find('StacksContainer');
    }

    const stacks = { fetching: false, value: ['expectedArray'] };
    const currentProject = { fetching: false, value: 'testproj' };
    const store = createStore()({
      stacks,
      currentProject,
    });

    it('extracts the correct props from the redux state', () => {
      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('stacks')).toBe(stacks);
    });

    it('binds correct actions', () => {
      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toMatchSnapshot();
    });

    it('loadStacks function dispatches correct action', () => {
      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadStacksByCategory();
      const { type, payload } = store.getActions()[0];
      expect(type).toBe('LOAD_STACKS_BY_CATEGORY');
      return payload.then(value => expect(value).toBe('expectedPayload'));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureStacksContainer {...props} />);
    }

    const stacks = {
      fetching: false,
      value: [
        { prop: 'prop1' },
        { prop: 'prop2' },
      ],
    };

    const openModalDialogMock = jest.fn();
    const closeModalDialogMock = jest.fn();
    const getUrlMock = jest.fn();
    const openStackMock = jest.fn();
    const createStackMock = jest.fn();
    const deleteStackMock = jest.fn();
    const restFormMock = jest.fn();
    const getLogsMock = jest.fn();
    const shareStackMock = jest.fn();
    const updateStackShareStatusMock = jest.fn();

    const generateProps = () => ({
      stacks,
      typeName: 'Notebook',
      containerType: 'analysis',
      dialogAction: 'ACTION',
      formStateName: 'createNotebook',
      userPermissions: ['expectedPermission'],
      actions: {
        loadStacksByCategory: loadStacksMock,
        getUrl: getUrlMock,
        openStack: openStackMock,
        createStack: createStackMock,
        deleteStack: deleteStackMock,
        openModalDialog: openModalDialogMock,
        closeModalDialog: closeModalDialogMock,
        resetForm: restFormMock,
        listUsers: listUsersMock,
        getLogs: getLogsMock,
        updateStackShareStatus: updateStackShareStatusMock,
        shareStack: shareStackMock,
      },
      projectKey: { fetching: false, value: 'projtest' },
    });

    beforeEach(() => jest.clearAllMocks());

    it('calls loadNotebooks action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadStacksMock).toHaveBeenCalledTimes(1);
    });

    it('setTimeout is called once the loadStackByCategory has resolved', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = new PureStacksContainer(props);

      // Assert
      expect(loadStacksMock).toHaveBeenCalledTimes(0);
      expect(listUsersMock).toHaveBeenCalledTimes(0);
      expect(setTimeout).toHaveBeenCalledTimes(0);
      return output.loadStack().then(() => {
        expect(loadStacksMock).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(1);
      });
    });

    it('passes correct props to StackCard', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });

    it('openNotebook method calls openNotebook action on resolved getUrl', () => {
      // Arrange
      getUrlMock.mockReturnValue(Promise.resolve({ value: { redirectUrl: 'expectedUrl' } }));
      const props = generateProps();
      const output = shallowRenderPure(props);
      const openStack = output.prop('openStack');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(openStackMock).not.toHaveBeenCalled();
      return openStack({ id: 1000 })
        .then(() => {
          expect(getUrlMock).toHaveBeenCalledTimes(1);
          expect(getUrlMock).toHaveBeenCalledWith('projtest', 1000);
          expect(openStackMock).toHaveBeenCalledTimes(1);
          expect(openStackMock).toHaveBeenCalledWith('expectedUrl');
        });
    });

    it('openStack method calls toastr on unresolved getUrl', () => {
      // Arrange
      getUrlMock.mockReturnValue(Promise.reject(new Error('no url')));
      const props = generateProps();
      const output = shallowRenderPure(props);
      const openStack = output.prop('openStack');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(toastrErrorMock).not.toHaveBeenCalled();
      return openStack({ id: 1000 })
        .then(() => {
          expect(getUrlMock).toHaveBeenCalledTimes(1);
          expect(getUrlMock).toHaveBeenCalledWith('projtest', 1000);
          expect(toastrErrorMock).toHaveBeenCalledTimes(1);
          expect(toastrErrorMock).toHaveBeenCalledWith('Unable to open Notebook');
        });
    });

    it('confirmDeleteStack calls openModalDialog with correct action', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act/Assert
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      deleteStack(stack);
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('MODAL_TYPE_CONFIRMATION');
    });

    it('confirmDeleteStack generates correct dialog', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

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

    it('confirmDeleteStack - onSubmit calls deleteStack with correct value', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act
      const output = shallowRenderPure(props);
      const deleteStack = output.prop('deleteStack');
      deleteStack(stack);
      const { onSubmit } = openModalDialogMock.mock.calls[0][1];

      // Assert
      expect(deleteStackMock).not.toHaveBeenCalled();
      return onSubmit()
        .then(() => {
          expect(deleteStackMock).toHaveBeenCalledTimes(1);
          expect(deleteStackMock).toHaveBeenCalledWith(stack);
        });
    });

    it('confirmShareStack calls openModalDialog with correct action', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act/Assert
      const output = shallowRenderPure(props);
      const shareStack = output.prop('shareStack');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      shareStack(stack, 'project');
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('MODAL_TYPE_SHARE_STACK');
    });

    it('confirmShareStack generates correct dialog', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act
      const output = shallowRenderPure(props);
      const shareStack = output.prop('shareStack');
      shareStack(stack, 'project');

      // Assert
      const firstMockCall = openModalDialogMock.mock.calls[0];
      const { title, body, onCancel } = firstMockCall[1];
      expect({ title, body }).toMatchSnapshot();
      expect(onCancel).toBe(closeModalDialogMock);
    });

    it('confirmShareStack - onSubmit calls shareStack with correct value', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act
      const output = shallowRenderPure(props);
      const shareStack = output.prop('shareStack');
      shareStack(stack, 'project');
      const { onSubmit } = openModalDialogMock.mock.calls[0][1];

      // Assert
      expect(updateStackShareStatusMock).not.toHaveBeenCalled();
      return onSubmit()
        .then(() => {
          expect(updateStackShareStatusMock).toHaveBeenCalledTimes(1);
          expect(updateStackShareStatusMock).toHaveBeenCalledWith({ ...stack, shared: 'project' });
        });
    });

    it('openCreationForm calls openModalDialog with correct action', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

      // Act/Assert
      const output = shallowRenderPure(props);
      const openCreationForm = output.prop('openCreationForm');
      expect(openModalDialogMock).not.toHaveBeenCalled();
      openCreationForm(stack);
      expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      const firstMockCall = openModalDialogMock.mock.calls[0];
      expect(firstMockCall[0]).toBe('ACTION');
    });

    it('openCreationForm generates correct dialog', () => {
      // Arrange
      const props = generateProps();
      const stack = { displayName: 'expectedDisplayName' };

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
      const stack = { projectKey: 'projtest', displayName: 'expectedDisplayName' };

      // Act
      const output = shallowRenderPure(props);
      const openCreationForm = output.prop('openCreationForm');
      openCreationForm();
      const { onSubmit } = openModalDialogMock.mock.calls[0][1];

      // Assert
      expect(createStackMock).not.toHaveBeenCalled();
      expect(restFormMock).not.toHaveBeenCalled();
      expect(loadStacksMock).toHaveBeenCalledTimes(1);
      return onSubmit(stack)
        .then(() => {
          expect(createStackMock).toHaveBeenCalledTimes(1);
          expect(createStackMock).toHaveBeenCalledWith(stack);
          expect(restFormMock).toHaveBeenCalledTimes(1);
          expect(restFormMock).toHaveBeenCalledWith('createNotebook');
        });
    });
  });
});
