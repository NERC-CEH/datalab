import React from 'react';
import { render } from '../../testUtils/renderTests';
import SuspendWarning from './SuspendWarning';

describe('SuspendWarning', () => {
  it('renders correct snapshot', () => {
    const wrapper = render(<SuspendWarning message="message">{'expectedChild'}</SuspendWarning>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
