import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import IconButton from './IconButton';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<IconButton {...props} />);
}

describe('IconButton', () => {
  const generateProps = () => ({
    onClick: () => {},
    children: 'buttonText',
    icon: 'store',
  });

  it('creates correct snapshot for required props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for danger styled button', () => {
    // Arrange
    const props = {
      ...generateProps(),
      danger: true,
    };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
