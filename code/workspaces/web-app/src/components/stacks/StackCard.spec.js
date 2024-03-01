import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { render } from '../../testUtils/renderTests';
import StackCard from './StackCard';
import { storageDescription, storageDisplayValue } from '../../config/storage';
import { initialiseFeatureFlags } from '../../config/featureFlags';

const httpMock = new MockAdapter(axios);

jest.mock('../../hooks/usersHooks');
jest.mock('../../config/storage');

jest.mock('./StackCardActions/StackCardActions', () => props => (<div>StackCardActions mock {JSON.stringify(props)} </div>));
jest.mock('./StackStatus', () => props => (<div>StackStatus mock {JSON.stringify(props)}</div>));

beforeEach(async () => {
  storageDescription.mockReturnValue('Network File System (NFS) volume to store data for Notebooks and Sites.');
  storageDisplayValue.mockReturnValue('NFS');
  httpMock.onGet('/feature_flags_config.json').reply(() => [200, {
    requestProjects: false,
    expireUnusedNotebooks: {
      accessTimeWarning: 14,
      accessTimeLimit: 31,
      inUseTimeWarning: 5,
    },
  }]);
  await initialiseFeatureFlags();
});

describe('StackCard', () => {
  const permissionProps = {
    userPermissions: ['open', 'delete', 'edit'],
    openPermission: 'open',
    deletePermission: 'delete',
    editPermission: 'edit',
  };

  const generateProps = (type, status, accessTime) => ({
    stack: {
      id: '100',
      displayName: 'name1',
      type,
      status,
      shared: 'private',
      accessTime,
    },
    openStack: jest.fn().mockName('openStack'),
    deleteStack: jest.fn().mockName('deleteStack'),
    shareStack: jest.fn().mockName('shareStack'),
    restartStack: jest.fn().mockName('restartStack'),
    copySnippets: {
      Python: jest.fn().mockName('copyPythonSnippet'),
    },
    typeName: 'Notebook',
    ...permissionProps,
  });

  it('creates correct snapshot for Jupyter stack type', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for Zeppelin stack type', () => {
    // Arrange
    const props = generateProps('zeppelin');

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for glusterfs stack type', () => {
    // Arrange
    const props = { ...generateProps('GLUSTERFS'), typeName: 'Data Store' };

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('should show status ad buttons when status is ready', () => {
    // Arrange
    const props = generateProps('jupyter', 'ready');

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('an rstudio notebook that should only have a RECENTLY OPENED warning', async () => {
    // Arrange
    const hoursSinceLastAccessed = 2;
    const lastAccessTime = Date.now() - (1000 * 60 * 60 * hoursSinceLastAccessed);
    const props = generateProps('rstudio', 'ready', lastAccessTime);

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('an rstudio notebook that should only have a NOT ACCESSED warning', async () => {
    // Arrange
    const daysSinceLastAccessed = 20;
    const lastAccessTime = Date.now() - (1000 * 60 * 60 * 24 * daysSinceLastAccessed);
    const props = generateProps('rstudio', 'ready', lastAccessTime);

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('a recently opened vscode notebook that should NOT have a RECENTLY OPENED warning', async () => {
    // Arrange
    const hoursSinceLastAccessed = 2;
    const lastAccessTime = Date.now() - (1000 * 60 * 60 * hoursSinceLastAccessed);
    const props = generateProps('vscode', 'ready', lastAccessTime);

    // Act
    const output = render(<StackCard {...props} />).container;

    // Assert
    expect(output).toMatchSnapshot();
  });
});
