import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import StacksContainer, { PureStacksContainer } from './StacksContainer';
import stackService from '../../api/stackService';
import notify from '../../components/common/notify';

jest.mock('../../api/stackService');
const loadStacksMock = jest.fn().mockReturnValue('expectedPayload');
stackService.loadStacksByCategory = loadStacksMock;

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
      };

      return shallow(<StacksContainer {...props} />);
    }

    const stacks = { fetching: false, value: ['expectedArray'] };
    const store = createStore()({
      stacks,
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
      expect(Object.keys(output)).toEqual(expect.arrayContaining(['loadStacks', 'openStack']));
    });

    it('loadStacks function dispatches correct action', () => {
      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').loadStacksByCategory();
      expect(store.getActions()[0]).toEqual({
        type: 'LOAD_STACKS_BY_CATEGORY',
        payload: 'expectedPayload',
      });
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

    const generateActions = () => ({
      loadStacksByCategory: loadStacksMock,
      getUrl: () => {},
      openStack: () => {},
      createStack: () => {},
      deleteStack: () => {},
    });

    const generateProps = () => ({
      stacks,
      typeName: 'Notebook',
      containerType: 'analysis',
      dialogAction: 'ACTION',
      formStateName: 'createNotebook',
      actions: generateActions(),
    });

    beforeEach(() => jest.resetAllMocks());

    it('calls loadNotebooks action when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(loadStacksMock).toHaveBeenCalledTimes(1);
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

      const openStackMock = jest.fn();

      const props = {
        ...generateProps(),
        actions: {
          ...generateActions(),
          getUrl: getUrlMock,
          openStack: openStackMock,
        },
      };

      const output = shallowRenderPure(props);
      const openStack = output.childAt(0).prop('openStack');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(openStackMock).not.toHaveBeenCalled();
      openStack(1000).then(() => {
        expect(getUrlMock).toHaveBeenCalledTimes(1);
        expect(getUrlMock).toHaveBeenCalledWith(1000);
        expect(openStackMock).toHaveBeenCalledTimes(1);
        expect(openStackMock).toHaveBeenCalledWith('expectedUrl');
      });
    });

    it('openStack method calls toastr on resolved getUrl', () => {
      // Arrange
      jest.mock('../../components/common/notify');
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
      const openStack = output.childAt(0).prop('openStack');

      // Act/Assert
      expect(getUrlMock).not.toHaveBeenCalled();
      expect(toastrErrorMock).not.toHaveBeenCalled();
      openStack(1000).then(() => {
        expect(getUrlMock).toHaveBeenCalledTimes(1);
        expect(getUrlMock).toHaveBeenCalledWith(1000);
        expect(toastrErrorMock).toHaveBeenCalledTimes(1);
        expect(toastrErrorMock).toHaveBeenCalledWith('Unable to open Notebook');
      });
    });
  });
});
