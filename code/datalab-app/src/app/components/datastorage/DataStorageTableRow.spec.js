import React from 'react';
import { shallow } from 'enzyme';
import DataStorageTableRow from './DataStorageTableRow';

it('DataStorageTableRow renders correct snapshot', () => {
  // Arrange
  const dataStore = {
    capacityTotal: 111,
    capacityUsed: 222,
    linkToStorage: 'expectedLink',
    name: 'expectedName',
    storageType: 'expectedType',
    accessKey: 'accessKey',
  };
  const openStorageAction = 'mockAction';

  // Act/Assert
  const renderedComponent = shallow(<DataStorageTableRow
    dataStore={dataStore}
    openStorageAction={openStorageAction}/>);
  expect(renderedComponent).toMatchSnapshot();
});
