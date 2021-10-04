import React from 'react';
import { shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import NavigationContainer, { PureNavigationContainer } from './NavigationContainer';

jest.mock('../../components/app/Navigation', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>Navigation</>),
}));

describe('NavigationContainer', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected() {
      const store = createStore()({
        authentication: {
          identity: { expected: 'Identity' },
        },
      });

      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<NavigationContainer {...props} />).find('NavigationContainer');
    }

    it('extracts the correct props from the redux state', () => {
      // Act
      const output = shallowRenderConnected();

      // Assert
      expect(output.prop('identity')).toEqual({ expected: 'Identity' });
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure() {
      const props = {
        identity: { expected: 'Identity' },
        anotherProp: 'something',
      };

      return shallow(<PureNavigationContainer {...props} />);
    }
    it('passes correct props to Navigation', () => {
      expect(shallowRenderPure()).toMatchSnapshot();
    });
  });
});
