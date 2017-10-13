import React from 'react';
import { shallow } from 'enzyme';
import NewStackButton from './NewStackButton';

describe('New Stack Button', () => {
  function shallowRender(props) {
    return shallow(<NewStackButton {...props} />);
  }

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
