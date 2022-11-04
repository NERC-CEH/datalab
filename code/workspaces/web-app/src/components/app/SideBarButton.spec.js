import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { render } from '../../testUtils/renderTests';
import SideBarButton from './SideBarButton';

describe('SideBarButton', () => {
  const history = createMemoryHistory();

  it('correctly passes props to wrapped component', () => {
    const wrapper = render(
      <Router history={history}>
        <SideBarButton label='Test Label' to='/testendpoint'/>
      </Router>,
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
