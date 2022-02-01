import React from 'react';
import { render } from '../../testUtils/renderTests';
import Navigation from './Navigation';

jest.mock('./MessageBanner', () => () => (<>MessageBanner Mock</>));
jest.mock('./TopBar', () => props => (<>Top Bar Mock {JSON.stringify(props)}</>));

describe('DescribeDatalabs', () => {
  it('renders correct snapshot', () => {
    const wrapper = render(
      <Navigation identity={{ expected: 'identity' }} userPermissions={['expectedPermission']} >
        <span>Content</span>
      </Navigation>,
    );

    expect(wrapper.container).toMatchSnapshot();
  });
});
