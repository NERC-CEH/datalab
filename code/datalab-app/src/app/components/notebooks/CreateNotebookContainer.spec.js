import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import CreateNotebookContainer, { PureCreateNotebookContainer } from './CreateNotebookContainer';
import CreateNotebookForm from './CreateNotebookForm';
import notify from '../common/notify';

const notebook = { name: 'Name' };

describe('NotebooksContainer', () => {
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
      const store = createStore()({});

      const output = shallowRenderConnected(store);

      expect(output.prop('notebook')).toEqual({});
    });

    it('provides empty notebook if the form does not yet exist in the redux state', () => {
      const store = createStore()({
        form: { createNotebook: { values: notebook } },
      });

      const output = shallowRenderConnected(store);

      expect(output.prop('notebook')).toEqual(notebook);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({});

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
      const props = { notebook };

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });

    it('createNotebook method calls load notebooks action on successful creation', () => {
      // Arrange
      const createNotebookMock = jest.fn().mockReturnValue(Promise.resolve('success'));
      const loadNotebooksMock = jest.fn().mockReturnValue(Promise.resolve('success'));

      const props = {
        notebook,
        actions: {
          createNotebook: createNotebookMock,
          loadNotebooks: loadNotebooksMock,
        },
      };

      const output = shallowRenderPure(props);
      const createNotebookForm = output.find(CreateNotebookForm);
      const submit = createNotebookForm.prop('onSubmit');

      // Act/Assert
      submit(notebook).then(() => {
        expect(createNotebookMock).toHaveBeenCalledTimes(1);
        expect(createNotebookMock).toHaveBeenCalledWith(notebook);
        expect(loadNotebooksMock).toHaveBeenCalledTimes(1);
        expect(toastrSuccessMock).toHaveBeenCalledTimes(1);
      });
    });

    it('openNotebook method calls toastr  on resolved getUrl', () => {
      // Arrange
      const createNotebookMock = jest.fn().mockReturnValue(Promise.reject('failed'));
      const loadNotebooksMock = jest.fn();

      const props = {
        notebook,
        actions: {
          createNotebook: createNotebookMock,
          loadNotebooks: loadNotebooksMock,
        },
      };

      const output = shallowRenderPure(props);
      const createNotebookForm = output.find(CreateNotebookForm);
      const submit = createNotebookForm.prop('onSubmit');

      // Act/Assert
      submit(notebook).then(() => {
        expect(createNotebookMock).toHaveBeenCalledTimes(1);
        expect(loadNotebooksMock).not.toHaveBeenCalled();
        expect(toastrErrorMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
