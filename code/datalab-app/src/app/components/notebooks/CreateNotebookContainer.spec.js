import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import CreateNotebookContainer, { PureCreateNotebookContainer } from './CreateNotebookContainer';
import NewNotebookButton from './NewNotebookButton';
import notify from '../common/notify';

const notebook = { name: 'Name' };

describe('NotebooksContainer', () => {
  const createStackMock = jest.fn();
  const loadStacksMock = jest.fn();
  const openModalDialogMock = jest.fn();

  function createProps() {
    return {
      notebook,
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
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<CreateNotebookContainer {...props} />);
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
      return shallow(<PureCreateNotebookContainer {...props} />);
    }

    beforeEach(() => jest.resetAllMocks());

    jest.mock('../common/notify');
    const toastrSuccessMock = jest.fn();
    const toastrErrorMock = jest.fn();
    notify.success = toastrSuccessMock;
    notify.error = toastrErrorMock;

    it('passes correct props to NotebookCard', () => {
      // Arrange
      const props = {
        notebook,
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

    it('createNotebook method calls load notebooks action on successful creation', () => {
      // Arrange
      openModalDialogMock.mockReturnValue(Promise.resolve('success'));

      const props = createProps();

      const output = shallowRenderPure(props);
      const newNotebookButton = output.find(NewNotebookButton);
      const openDialog = newNotebookButton.prop('onClick');

      // Act/Assert
      openDialog(notebook).then(() => {
        expect(openModalDialogMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
