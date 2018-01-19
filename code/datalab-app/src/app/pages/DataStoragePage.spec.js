import React from 'react';
import { shallow } from 'enzyme';
import DataStoragePage from './DataStoragePage';

it('DataStorageTablePage renders correct snapshot', () => {
  expect(shallow(<DataStoragePage/>)).toMatchSnapshot();
});
