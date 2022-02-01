import React from 'react';
import createStore from 'redux-mock-store';
import { render } from '../../testUtils/renderTests';
import PreviewDataStoreCard, { PurePreviewDataStoreCard } from './PreviewDataStoreCard';
import { renderWithState, buildDefaultTestState } from '../../testUtils/renderWithState';

jest.mock('../stacks/StackCard', () => props => <div>StackCard mock {JSON.stringify(props)}</div>);

const stack = { name: 'Name' };

describe('PreviewDataStoreCard', () => {
  function createDefaultStore() {
    return createStore()({
      modalDialog: { open: false },
      form: { createDataStore: { values: stack } },
    });
  }

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      const state = buildDefaultTestState();
      state.modalDialog = { open: false };
      state.form = { createDataStore: { values: stack } };
      const { wrapper } = renderWithState(state, PreviewDataStoreCard, props);
      return wrapper;
    }

    it('extracts the form values from the redux state', () => {
      const store = createStore()({
        modalDialog: { open: false },
      });

      const wrapper = shallowRenderConnected(store);
      expect(wrapper.getByText('"stack":{}', { exact: false })).not.toBeNull();
    });

    it('provides empty notebook if the form does not yet exist in the redux state', () => {
      const store = createDefaultStore();

      const wrapper = shallowRenderConnected(store);
      expect(wrapper.getByText('"stack":{"name":"Name"}', { exact: false })).not.toBeNull();
    });
  });

  describe('is a component which', () => {
    function shallowRenderPure() {
      const props = {
        stack: 'expectedStack',
      };

      return render(<PurePreviewDataStoreCard {...props} />).container;
    }
    it('passes correct props to StackCards', () => {
      expect(shallowRenderPure()).toMatchSnapshot();
    });
  });
});
