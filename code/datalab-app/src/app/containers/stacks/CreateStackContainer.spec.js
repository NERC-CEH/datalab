import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import CreateStackContainer, { PureCreateStackContainer } from './CreateStackContainer';
import NewStackButton from '../../components/stacks/NewStackButton';
import notify from '../../components/common/notify';

const stack = { name: 'Name' };

describe('CreateStackContainer', () => {
  const createStackMock = jest.fn();
  const loadStacksMock = jest.fn();
  const openModalDialogMock = jest.fn();

  function createProps() {
    return {
      stack,
      typeName: 'Notebook',
      containerType: 'analysis',
      dialogAction: 'ACTION',
      formStateName: 'createNotebook',
      actions: {
        createStack: createStackMock,
        loadStacks: loadStacksMock,
        openModalDialog: openModalDialogMock,
        closeModalDialog: () => {},
      },
    };
  }

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        ...createProps(),
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<CreateStackContainer {...props} />);
    }

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        modalDialog: { open: false },
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toEqual(expect.arrayContaining(['createStack', 'loadStacks']));
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureCreateStackContainer {...props} />);
    }

    beforeEach(() => jest.resetAllMocks());

    jest.mock('../../components/common/notify');
    const toastrSuccessMock = jest.fn();
    const toastrErrorMock = jest.fn();
    notify.success = toastrSuccessMock;
    notify.error = toastrErrorMock;

    it('passes correct props to StackCard', () => {
      // Arrange
      const props = {
        stack,
        typeName: 'Notebook',
        containerType: 'analysis',
        dialogAction: 'ACTION',
        formStateName: 'createNotebook',
        dialogOpen: true,
        actions: {
          openModalDialog: () => {},
          closeModalDialog: () => {},
          deleteNotebook: () => {},
        },
      };

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });

    it('createStack method calls load stacks action on successful creation', () => {
      // Arrange
      openModalDialogMock.mockReturnValue(Promise.resolve('success'));

      const props = createProps();

      const output = shallowRenderPure(props);
      const newStackButton = output.find(NewStackButton);
      const openDialog = newStackButton.prop('onClick');

      // Act/Assert
      openDialog(stack).then(() => {
        expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
