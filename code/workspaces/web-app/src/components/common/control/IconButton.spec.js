import React from 'react';
import { render } from '@testing-library/react';
import IconButton from './IconButton';

describe('IconButton', () => {
  const generateProps = () => ({
    onClick: () => {},
    children: 'buttonText',
    icon: 'store',
  });

  it('creates correct snapshot for required props', () => {
    const wrapper = render(<IconButton {...generateProps()} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('creates correct snapshot for danger styled button', () => {
    const props = {
      ...generateProps(),
      danger: true,
    };

    const wrapper = render(<IconButton {...props} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
