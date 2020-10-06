import React from 'react';
import { shallow } from 'enzyme';
import StackCards from './StackCards';

describe('StackCards', () => {
  function shallowRender(props) {
    return shallow(<StackCards {...props} />);
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
    openStack: () => {},
    deleteStack: () => {},
    openCreationForm: () => {},
    userPermissions: () => ['open', 'delete', 'create', 'edit'],
    openPermission: 'open',
    deletePermission: 'delete',
    createPermission: 'create',
    editPermission: 'edit',
  });

  it('creates correct snapshot for an array of stacks', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
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
});
