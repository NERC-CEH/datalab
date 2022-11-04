import React from 'react';
import { render } from '../../../testUtils/renderTests';
import IconButton from './IconButton';

describe('IconButton', () => {
  const generateProps = () => ({
    onClick: () => {},
    children: 'buttonText',
    icon: 'store',
  });

  it('creates correct snapshot for required props', () => {
    const wrapper = render(<IconButton {...generateProps()} size="large" />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('creates correct snapshot for danger styled button', () => {
    const props = {
      ...generateProps(),
      danger: true,
    };

    const wrapper = render(<IconButton {...props} size="large" />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
