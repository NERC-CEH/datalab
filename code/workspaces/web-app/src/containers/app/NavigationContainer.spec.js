import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureNavigationContainer } from './NavigationContainer';

jest.mock('../../components/app/Navigation', () => props => (<>Navigation Mock {JSON.stringify(props)}</>));

describe('NavigationContainer', () => {
  describe('is a container which', () => {
    const props = {
      identity: { expected: 'Identity' },
      anotherProp: 'something',
    };

    it('passes correct props to Navigation', () => {
      expect(render(<PureNavigationContainer {...props} />).container).toMatchSnapshot();
    });
  });
});
