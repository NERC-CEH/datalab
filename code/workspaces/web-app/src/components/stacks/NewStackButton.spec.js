import React from 'react';
import { render } from '../../testUtils/renderTests';
import NewStackButton from './NewStackButton';

describe('New Stack Button', () => {
  const generateProps = () => ({
    onClick: () => {},
    typeName: 'Stack',
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = render(<NewStackButton {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('uses labelPrefix if present', () => {
    const props = generateProps();
    props.labelPrefix = 'Request';

    const output = render(<NewStackButton {...props} />).container;

    expect(output).toMatchSnapshot();
  });
});
