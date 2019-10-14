import React from 'react';
import { shallow } from 'enzyme';
import StackCards, { sortStacksByDisplayName } from './StackCards';

describe('StackCards', () => {
  function shallowRender(props) {
    return shallow(<StackCards {...props} />);
  }

  const generateProps = () => ({
    stacks: [
      { displayName: 'name1', id: '1', type: 'type1' },
      { displayName: 'name2', id: '2', type: 'type2' },
      { displayName: 'name3', id: '3', type: 'type3' },
    ],
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

  it('creates correct snapshot for an array of notebooks', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for an empty array', () => {
    // Arrange
    const props = { ...generateProps(), stacks: [] };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});

describe('sortByDisplayName', () => {
  const sortsFirst = { displayName: 'A Project' };
  const sortsSecond = { displayName: 'Data Analysis Project' };
  const sortsThird = { displayName: 'Zebra Stripe Effects' };

  const orderedStacks = [sortsFirst, sortsSecond, sortsThird];

  it('correctly sorts stacks alphabetically descending by their displayName', () => {
    const stacksOne = [sortsThird, sortsFirst, sortsSecond];
    expect(stacksOne.sort(sortStacksByDisplayName)).toEqual(orderedStacks);

    const stacksTwo = [sortsThird, sortsSecond, sortsFirst];
    expect(stacksTwo.sort(sortStacksByDisplayName)).toEqual(orderedStacks);

    const stacksThree = [sortsFirst, sortsSecond, sortsThird];
    expect(stacksThree.sort(sortStacksByDisplayName)).toEqual(orderedStacks);
  });
});
