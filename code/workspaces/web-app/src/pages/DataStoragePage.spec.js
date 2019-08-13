import React from 'react';
import { shallow } from 'enzyme';
import DataStoragePage from './DataStoragePage';

it('DataStoragePage renders correct snapshot', () => {
  expect(shallow(<DataStoragePage userPermissions={['expectedPermission']} />)).toMatchSnapshot();
});
