import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import PreviewSiteCard, { PurePreviewSiteCard } from './PreviewSiteCard';

const stack = { name: 'Name' };

describe('Preview SiteCard', () => {
  function createDefaultStore() {
    return createStore()({
      modalDialog: { open: false },
      form: { createSite: { values: stack } },
    });
  }

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<PreviewSiteCard {...props} />).find('PreviewSiteCard');
    }

    it('extracts the form values from the redux state', () => {
      const store = createStore()({
        modalDialog: { open: false },
      });

      const output = shallowRenderConnected(store);

      expect(output.prop('stack')).toEqual({});
    });

    it('provides empty stack if the form does not yet exist in the redux state', () => {
      const store = createDefaultStore();

      const output = shallowRenderConnected(store);

      expect(output.prop('stack')).toEqual(stack);
    });
  });

  describe('is a component which', () => {
    function shallowRenderPure() {
      const props = {
        stack: 'expectedStack',
      };

      return shallow(<PurePreviewSiteCard {...props} />);
    }
    it('passes correct props to StackCards', () => {
      expect(shallowRenderPure()).toMatchSnapshot();
    });
  });
});
