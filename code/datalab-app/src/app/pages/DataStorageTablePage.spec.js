import React from 'react';
import { shallow } from 'enzyme';
import DataStorageTablePage from './DataStorageTablePage';

it('DataStorageTablePage renders correct snapshot', () => {
  expect(shallow(<DataStorageTablePage/>)).toMatchSnapshot();
});
