import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import StackCard from './StackCard';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<StackCard {...props} />);
}

describe('StackCard', () => {
  const openStackMock = jest.fn();
  const deleteStackMock = jest.fn();

  const permissionProps = {
    userPermissions: ['open', 'delete'],
    openPermission: 'open',
    deletePermission: 'delete',
  };

  const generateProps = type => ({
    stack: {
      id: '100',
      displayName: 'name1',
      type,
      status: 'ready',
    },
    openStack: openStackMock,
    deleteStack: deleteStackMock,
    typeName: 'notebook',
    ...permissionProps,
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

  it('Open button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);
    const onClick = output.find({ children: 'Open' }).prop('onClick');

    // Assert
    expect(openStackMock).not.toHaveBeenCalled();
    onClick();
    expect(openStackMock).toHaveBeenCalledTimes(1);
    expect(openStackMock).toHaveBeenCalledWith('100');
  });

  it('Delete button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);
    const onClick = output.find({ children: 'Delete' }).prop('onClick');

    // Assert
    expect(deleteStackMock).not.toHaveBeenCalled();
    onClick();
    expect(deleteStackMock).toHaveBeenCalledTimes(1);
    expect(deleteStackMock).toHaveBeenCalledWith({ displayName: 'name1', id: '100', type: 'jupyter', status: 'ready' });
  });

  it('should provide defaults and disable the open button if no stack is provided', () => {
    // Arrange
    const props = {
      stack: {},
      typeName: 'typeName',
      ...permissionProps,
    };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
