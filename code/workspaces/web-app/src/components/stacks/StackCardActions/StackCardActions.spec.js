import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { useCurrentUserId } from '../../../hooks/authHooks';
import StackCardActions, { PureStackCardActions } from './StackCardActions';

jest.mock('../../../hooks/authHooks');

const openStackMock = jest.fn();
const deleteStackMock = jest.fn();
const editStackMock = jest.fn();
const shareStackMock = jest.fn();

const generateProps = () => ({
  stack: {
    id: 'abc1234',
    displayName: 'expectedDisplayName',
    type: 'expectedType',
    status: 'ready',
    users: ['owner-id'],
    shared: 'private',
  },
  currentUserId: 'owner-id',
  openStack: openStackMock,
  deleteStack: deleteStackMock,
  editStack: editStackMock,
  shareStack: shareStackMock,
  userPermissions: ['open', 'delete', 'edit'],
  openPermission: 'open',
  deletePermission: 'delete',
  editPermission: 'edit',
  classes: {
    cardActions: 'cardActions',
    buttonWrapper: 'buttonWrapper',
  },
});

describe('StackCardActions', () => {
  useCurrentUserId.mockReturnValue('expected-user-id');
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('passes props down to child component as well as current user id', () => {
    const props = generateProps();
    delete props.classes;

    expect(shallow(<StackCardActions {...props} />)).toMatchSnapshot();
  });
});

describe('PureStackCardActions', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  function shallowRender(props) {
    return shallow(<PureStackCardActions {...props} />);
  }

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

  it('Should render Open as disabled if stack is not ready', () => {
    // Arrange
    const baseProps = generateProps();
    const props = { ...baseProps, stack: { status: 'requested' } };
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
      users: ['owner-id'],
      shared: 'private',
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
      users: ['owner-id'],
      shared: 'private',
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
      users: ['owner-id'],
      shared: 'private',
    });
  });

  it('Should not render edit/delete/share/restart buttons if current user is not the owner', () => {
    const props = generateProps();
    props.currentUserId = 'not-the-owner-id';
    expect(shallowRender(props)).toMatchSnapshot();
  });
});
