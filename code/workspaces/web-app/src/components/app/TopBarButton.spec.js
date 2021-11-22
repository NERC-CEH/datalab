import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import TopBarButton from './TopBarButton';

describe('TopBarButton', () => {
  const history = createMemoryHistory();

  it('correctly passes props to wrapped component', () => {
    const wrapper = render(<Router history={history}><TopBarButton label='Test Label' to='/testendpoint'/></Router>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
