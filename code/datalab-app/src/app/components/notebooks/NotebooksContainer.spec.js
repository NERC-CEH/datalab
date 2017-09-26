import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import NotebooksContainer, { PureNotebooksContainer } from './NotebooksContainer';
import notebookService from '../../api/notebookService';
import notify from '../common/notify';

jest.mock('../../api/notebookService');
const loadNotebooksMock = jest.fn().mockReturnValue('expectedPayload');
notebookService.loadNotebooks = loadNotebooksMock;

describe('NotebooksContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<NotebooksContainer {...props} />);
    }

    const notebooks = { fetching: false, value: ['expectedArray'] };

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const store = createStore()({
        notebooks,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('notebooks')).toBe(notebooks);
    });

    it('binds correct actions', () => {
      // Arrange
      const store = createStore()({
        notebooks,
      });

      // Act
      const output = shallowRenderConnected(store).prop('actions');

      // Assert
      expect(Object.keys(output)).toEqual(expect.arrayContaining(['loadNotebooks', 'openNotebook']));
    });

    it('loadNotebooks function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        notebooks,
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadNotebooks();
      expect(store.getActions()[0]).toEqual({
        type: 'LOAD_NOTEBOOKS',
        payload: 'expectedPayload',
      });
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure(props) {
      return shallow(<PureNotebooksContainer {...props} />);
    }

    const notebooks = {
      fetching: false,
      value: [
        { prop: 'prop1' },
        { prop: 'prop2' },
      ],
    };

    const generateActions = () => ({
      loadNotebooks: loadNotebooksMock,
      getUrl: () => {},
      openNotebook: () => {},
      createNotebook: () => {},
      deleteNotebook: () => {},
    });

    const generateProps = () => ({
      notebooks,
      actions: generateActions(),
    });

    beforeEach(() => jest.resetAllMocks());

    it('calls loadNotebooks action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadNotebooksMock).toHaveBeenCalledTimes(1);
    });

    it('passes correct props to NotebookCards', () => {
      // Arrange
      const props = generateProps();

      // Act
      expect(shallowRenderPure(props)).toMatchSnapshot();
    });

    it('openNotebook method calls openNotebook action on resolved getUrl', () => {
      // Arrange
      const getUrlMock = jest.fn()
        .mockReturnValue(Promise.resolve({ value: { redirectUrl: 'expectedUrl' } }));

      const openNotebookMock = jest.fn();

      const props = {
        ...generateProps(),
        actions: {
          ...generateActions(),
          getUrl: getUrlMock,
          openNotebook: openNotebookMock,
        },
      };

      const output = shallowRenderPure(props);
      const openNotebook = output.childAt(0).prop('openNotebook');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(openNotebookMock).not.toHaveBeenCalled();
      openNotebook(1000).then(() => {
        expect(getUrlMock).toHaveBeenCalledTimes(1);
        expect(getUrlMock).toHaveBeenCalledWith(1000);
        expect(openNotebookMock).toHaveBeenCalledTimes(1);
        expect(openNotebookMock).toHaveBeenCalledWith('expectedUrl');
      });
    });

    it('openNotebook method calls toastr  on resolved getUrl', () => {
      // Arrange
      jest.mock('../common/notify');
      const toastrErrorMock = jest.fn();
      notify.error = toastrErrorMock;

      const getUrlMock = jest.fn()
        .mockReturnValue(Promise.reject('no url'));

      const props = {
        ...generateProps(),
        actions: {
          ...generateActions(),
          getUrl: getUrlMock,
        },
      };

      const output = shallowRenderPure(props);
      const openNotebook = output.childAt(0).prop('openNotebook');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(toastrErrorMock).not.toHaveBeenCalled();
      openNotebook(1000).then(() => {
        expect(getUrlMock).toHaveBeenCalledTimes(1);
        expect(getUrlMock).toHaveBeenCalledWith(1000);
        expect(toastrErrorMock).toHaveBeenCalledTimes(1);
        expect(toastrErrorMock).toHaveBeenCalledWith('Unable to open Notebook');
      });
    });
  });
});
