import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import StackCardActions from './StackCardActions';

describe('StackCardActions', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  function shallowRender(props) {
    return shallow(<StackCardActions {...props} />);
  }

  const openStackMock = jest.fn();
  const deleteStackMock = jest.fn();
  const editStackMock = jest.fn();

  const generateProps = () => ({
    stack: {
      id: 'abc1234',
      displayName: 'expectedDisplayName',
      type: 'expectedType',
      status: 'ready',
    },
    openStack: openStackMock,
    deleteStack: deleteStackMock,
    editStack: editStackMock,
    userPermissions: ['open', 'delete', 'edit'],
    openPermission: 'open',
    deletePermission: 'delete',
    editPermission: 'edit',
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
    expect(openStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
    });
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

  it('Edit button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const onClick = output.find({ children: 'Edit' }).prop('onClick');

    // Assert
    expect(editStackMock).not.toHaveBeenCalled();
    onClick();
    expect(editStackMock).toHaveBeenCalledTimes(1);
    expect(editStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
    });
  });
});
