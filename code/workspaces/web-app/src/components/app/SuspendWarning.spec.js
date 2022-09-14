import React from 'react';
import { render } from '@testing-library/react';
import SuspendWarning from './SuspendWarning';

describe('SuspendWarning', () => {
  it('renders correct snapshot', () => {
    const wrapper = render(<SuspendWarning message="message">{'expectedChild'}</SuspendWarning>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
