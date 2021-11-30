import React from 'react';
import { render } from '@testing-library/react';
import StackCards from './StackCards';

jest.mock('./StackCard', () => props => (<div>StackCard mock {JSON.stringify(props)}</div>));

describe('StackCards', () => {
  function shallowRender(props) {
    return render(<StackCards {...props} />).container;
  }

  const generateProps = () => ({
    stacks: {
      fetching: false,
      value: [
        { displayName: 'name1', id: '1', type: 'type1' },
        { displayName: 'name2', id: '2', type: 'type2' },
        { displayName: 'name3', id: '3', type: 'type3' },
      ],
    },
    typeName: 'expectedTypeName',
    openStack: jest.fn().mockName('openStack'),
    deleteStack: jest.fn().mockName('deleteStack'),
    openCreationForm: jest.fn().mockName('openCreationForm'),
    editStack: jest.fn().mockName('editStack'),
    restartStack: jest.fn().mockName('restartStack'),
    copySnippets: {
      Python: jest.fn().mockName('copyPythonSnippet'),
    },
    userPermissions: () => ['open', 'delete', 'create', 'edit'],
    openPermission: 'open',
    deletePermission: 'delete',
    createPermission: 'create',
    editPermission: 'edit',
    showCreateButton: true,
  });

  it('creates correct snapshot for an array of stacks', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot with different action button label prefix', () => {
    const props = {
      ...generateProps(),
      stacks: { fetching: false, value: [] },
      actionButtonLabelPrefix: 'Request',
    };

    const output = shallowRender(props);

    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for an empty array', () => {
    // Arrange
    const props = { ...generateProps(), stacks: { fetching: false, value: [] } };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot when no create button', () => {
    // Arrange
    const props = { ...generateProps(), showCreateButton: false };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
