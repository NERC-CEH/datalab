import React from 'react';
import { shallow } from 'enzyme';
import StackCard from './StackCard';

describe('StackCard', () => {
  function shallowRender(props) {
    return shallow(<StackCard {...props} />);
  }

  const openStackMock = jest.fn();
  const deleteStackMock = jest.fn();

  const generateProps = type => ({
    stack: {
      id: '100',
      displayName: 'name1',
      type,
    },
    openStack: openStackMock,
    deleteStack: deleteStackMock,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for Jupyer stack type', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for Zeppelin stack type', () => {
    // Arrange
    const props = generateProps('zeppelin');

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('onCLick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);
    const onClick = output.find('Button').prop('onClick');

    // Assert
    expect(openStackMock).not.toHaveBeenCalled();
    onClick();
    expect(openStackMock).toHaveBeenCalledTimes(1);
    expect(openStackMock).toHaveBeenCalledWith('100');
  });

  it('should provide defaults and disable the open button if no stack is provided', () => {
    // Arrange
    const props = { stack: {} };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
