import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import PreviewNotebookCard from './PreviewNotebookCard';

const stack = { name: 'Name' };

describe('PreviewNotebookCard', () => {
  function createDefaultStore() {
    return createStore()({
      modalDialog: { open: false },
      form: { createNotebook: { values: stack } },
    });
  }

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<PreviewNotebookCard {...props} />);
    }

    it('extracts the form values from the redux state', () => {
      const store = createStore()({
        modalDialog: { open: false },
      });

      const output = shallowRenderConnected(store);

      expect(output.prop('stack')).toEqual({});
    });

    it('provides empty notebook if the form does not yet exist in the redux state', () => {
      const store = createDefaultStore();

      const output = shallowRenderConnected(store);

      expect(output.prop('stack')).toEqual(stack);
    });
  });
});
