import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import StackCard from './StackCard';
import { storageDescription, storageDisplayValue } from '../../config/storage';

jest.mock('../../hooks/usersHooks');
jest.mock('../../config/storage');

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<StackCard {...props} />);
}

beforeEach(() => {
  storageDescription.mockReturnValue('Network File System (NFS) volume to store data for Notebooks and Sites.');
  storageDisplayValue.mockReturnValue('NFS');
});

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
    openStack: jest.fn().mockName('openStack'),
    deleteStack: jest.fn().mockName('deleteStack'),
    shareStack: jest.fn().mockName('shareStack'),
    restartStack: jest.fn().mockName('restartStack'),
    copySnippets: {
      Python: jest.fn().mockName('copyPythonSnippet'),
    },
    typeName: 'notebook',
    ...permissionProps,
  });

  it('creates correct snapshot for Jupyter stack type', () => {
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

  it('creates correct snapshot for glusterfs stack type', () => {
    // Arrange
    const props = { ...generateProps('GLUSTERFS'), typeName: 'Data Store' };

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
