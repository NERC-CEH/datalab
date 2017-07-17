import React from 'react';
import { shallow } from 'enzyme';
import DataStorageTableRow from './DataStorageTableRow';

it('DataStorageTableRow renders correct snapshot', () => {
  // Arrange
  const dataStore = {
    capacityTotal: '111',
    capacityUsed: 222,
    linkToStorage: 'expectedLink',
    name: 'expectedName',
    storageType: 'expectedType',
  };

  // Act/Assert
  expect(shallow(<DataStorageTableRow dataStore={dataStore} />)).toMatchSnapshot();
});
