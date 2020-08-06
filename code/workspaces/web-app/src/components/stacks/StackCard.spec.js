import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import StackCard from './StackCard';

jest.mock('../../hooks/usersHooks');

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<StackCard {...props} />);
}

describe('StackCard', () => {
  const permissionProps = {
    userPermissions: ['open', 'delete', 'edit'],
    openPermission: 'open',
    deletePermission: 'delete',
    editPermission: 'edit',
  };

  const generateProps = (type, status) => ({
    stack: {
      id: '100',
      displayName: 'name1',
      type,
      status,
      shared: 'private',
    },
    openStack: () => {},
    deleteStack: () => {},
    shareStack: () => {},
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

  it('should show status ad buttons when status is ready', () => {
    // Arrange
    const props = generateProps('jupyter', 'ready');

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
