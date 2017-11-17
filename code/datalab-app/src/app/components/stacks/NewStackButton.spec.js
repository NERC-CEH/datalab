import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import NewStackButton from './NewStackButton';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<NewStackButton {...props} />);
}

describe('New Stack Button', () => {
  const generateProps = () => ({
    onClick: () => {},
    typeName: 'Stack',
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
