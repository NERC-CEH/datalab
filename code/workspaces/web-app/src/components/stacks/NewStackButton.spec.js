import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import NewStackButton from './NewStackButton';

function shallowRender(props) {
  const shallow = createShallow();
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

  it('uses labelPrefix if present', () => {
    const props = generateProps();
    props.labelPrefix = 'Request';

    const output = shallowRender(props);

    expect(output).toMatchSnapshot();
  });
});
