import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import CreateNotebookContainer, { PureCreateNotebookContainer } from './CreateNotebookContainer';
import NewNotebookButton from './NewNotebookButton';
import notify from '../common/notify';

const notebook = { name: 'Name' };

describe('NotebooksContainer', () => {
  function createDefaultStore() {
    return createStore()({
      modalDialog: { open: false },
      form: { createNotebook: { values: notebook } },
    });
  }

  const createNotebookMock = jest.fn();
  const loadNotebooksMock = jest.fn();
  const openModalDialogMock = jest.fn();

  function createProps() {
    return {
      notebook,
      dialogOpen: false,
      actions: {
        createNotebook: createNotebookMock,
        loadNotebooks: loadNotebooksMock,
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

    it('extracts the form values from the redux state', () => {
      const store = createStore()({
        modalDialog: { open: false },
      });

      const output = shallowRenderConnected(store);

      expect(output.prop('notebook')).toEqual({});
    });

    it('provides empty notebook if the form does not yet exist in the redux state', () => {
      const store = createDefaultStore();

      const output = shallowRenderConnected(store);

      expect(output.prop('notebook')).toEqual(notebook);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        modalDialog: { open: false },
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toEqual(expect.arrayContaining(['createNotebook', 'loadNotebooks']));
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
