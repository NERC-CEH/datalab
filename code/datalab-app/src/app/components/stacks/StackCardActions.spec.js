import React from 'react';
import { shallow } from 'enzyme';
import StackCardActions from './StackCardActions';

describe('StackCardActions', () => {
  function shallowRender(props) {
    return shallow(<StackCardActions {...props} />);
  }

  const openStackMock = jest.fn();
  const deleteStackMock = jest.fn();

  const generateProps = () => ({
    stack: {
      id: 'abc1234',
      displayName: 'expectedDisplayName',
      type: 'expectedType',
      status: 'ready',
    },
    openStack: openStackMock,
    deleteStack: deleteStackMock,
    userPermissions: ['open', 'delete'],
    openPermission: 'open',
    deletePermission: 'delete',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('Open button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const onClick = output.find({ children: 'Open' }).prop('onClick');

    // Assert
    expect(openStackMock).not.toHaveBeenCalled();
    onClick();
    expect(openStackMock).toHaveBeenCalledTimes(1);
    expect(openStackMock).toHaveBeenCalledWith('abc1234');
  });

  it('Delete button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const onClick = output.find({ children: 'Delete' }).prop('onClick');

    // Assert
    expect(deleteStackMock).not.toHaveBeenCalled();
    onClick();
    expect(deleteStackMock).toHaveBeenCalledTimes(1);
    expect(deleteStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
    });
  });
});
