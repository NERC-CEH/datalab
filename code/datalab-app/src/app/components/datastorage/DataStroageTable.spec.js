import React from 'react';
import { shallow } from 'enzyme';
import DataStorageTable from './DataStorageTable';

describe('DataStorageTable', () => {
  function shallowRender(dataStorage, openStorageAction) {
    return shallow(<DataStorageTable
      dataStorage={dataStorage} openStorageAction={openStorageAction} />);
  }

  it('renders correct snapshot', () => {
    // Arrange
    const dataStorage = [
      {
        capacityTotal: 111,
        capacityUsed: 222,
        linkToStorage: 'expectedLink',
        name: 'expectedName',
        storageType: 'expectedType',
        accessKey: 'token',
      },
    ];
    const openStorageAction = 'mockAction';

    // Act/Assert
    expect(shallowRender(dataStorage, openStorageAction)).toMatchSnapshot();
  });

  it('inserts correct number of rows', () => {
    expect(shallowRender([{}]).find('DataStorageTableRow').length).toBe(1);
    expect(shallowRender([{}, {}]).find('DataStorageTableRow').length).toBe(2);
    expect(shallowRender([{}, {}, {}]).find('DataStorageTableRow').length).toBe(3);
  });

  it('pass correct props to DataStorageTableRow', () => {
    // Arrange
    const dataStorage = [
      { childProp: 'expectedFirsChildProp' },
      { childProp: 'expectedSecondChildProp' },
      { childProp: 'expectedThirdChildProp' },
    ];

    // Act
    const output = shallowRender(dataStorage).find('DataStorageTableRow');

    // Assert
    output.forEach((child, index) => expect(child.prop('dataStore')).toBe(dataStorage[index]));
  });
});
